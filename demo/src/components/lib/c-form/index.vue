<template>
	<el-form
		ref="elForm"
		label-position="left"
		v-bind="$attrs"
		v-on="$listeners"
		:model="model"
		:class="['c-form', formClass]"
	>
		<slot>
			<template v-for="item in showColumn">
				<FormItem
					:formAttrs="$attrs"
					:key="item.uniKey || item.prop"
					:column="item"
					:form="model"
				/>
			</template>
		</slot>
		<el-form-item
			v-if="!hideAction"
			:style="{ opacity: showAction ? 1 : 0 }"
			ref="action-item"
			label=""
			class="item-shrinkage"
			:labelWidth="isInline ? $attrs['label-width'] : '0'"
		>
			<div
				style="text-align: right"
				:style="shrinkageBtnStyle"
			>
				<div
					style="display: inline-block"
					ref="actionBox"
					class="action-container"
				>
					<slot name="action">
						<c-button
							:loading="loading"
							class="has-icon"
							type="primary"
							@click.prevent="confirm"
						>
							查询
						</c-button>
						<c-button
							:loading="loading"
							class="has-icon"
							@click.prevent="reset"
							>重置</c-button
						>
					</slot>

					<div
						class="toggle-btn"
						@click="toggleOpen"
						v-if="isInline && !keep && !onlyOneLine"
					>
						<span v-if="isOpen">收起 <i class="el-icon-arrow-up"></i></span>
						<span v-else>展开 <i class="el-icon-arrow-down"></i></span>
					</div>
				</div>
			</div>
		</el-form-item>
	</el-form>
</template>

<script>
import FormItem from './form-item';
import { rafThrottle, CViewEventBus } from '../utils';

export default {
	name: 'c-form',
	props: {
		model: {
			type: Object,
			default: () => ({}),
		},
		formClass: {
			type: String,
			default: '',
		},
		column: {
			type: Array,
			default: () => [],
		},
		keep: {
			type: Boolean,
			default: () => false,
		},
		loading: {
			type: Boolean,
			default: () => false,
		},
		hideAction: {
			type: Boolean,
			default: () => false,
		},
		hideNumber: {
			type: Number,
			default: () => 1,
		},
		defaultOpen: {
			type: Boolean,
			default: () => true,
		},
	},
	components: {
		FormItem,
	},
	data() {
		return {
			rootForm: {},
			shrinkageBtnStyle: {},
			isOpen: this.defaultOpen,
			lastLineNum: Infinity,
			lineMax: Infinity,
			showAction: false,
			onlyOneLine: false,
		};
	},
	computed: {
		showColumn() {
			return this.column.filter((item) => {
				return item.show ? item.show(this.model) : true;
			});
		},
		isInline() {
			// eslint-disable-next-line no-prototype-builtins
			return this.$attrs.hasOwnProperty('inline');
		},
	},
	watch: {
		showColumn: function () {
			this.setShrinkage();
		},
	},
	methods: {
		confirm() {
			this.$emit('confirm');
		},
		reset() {
			this.$emit('reset');
		},
		asyncValidate() {
			return new Promise((resolve) => {
				this.$refs.elForm.validate((valid) => {
					resolve(valid);
				});
			});
		},
		validate(cb) {
			this.$refs.elForm.validate(cb);
		},
		validateField(props, cb) {
			this.$refs.elForm.validateField(props, cb);
		},
		resetFields() {
			this.$refs.elForm.resetFields();
		},
		clearValidate(props) {
			this.$refs.elForm.clearValidate(props);
		},
		setDefaultModel(column) {
			column.forEach((item) => {
				const { prop } = item;
				// eslint-disable-next-line no-prototype-builtins
				if (prop && !this.model.hasOwnProperty(prop)) {
					this.$set(this.model, prop, undefined);
				}
				if (item.renderList && item.renderList.length) {
					this.setDefaultModel(item.renderList);
				}
			});
		},
		toggleOpen() {
			this.isOpen = !this.isOpen;
			this.setShrinkage();
		},
		setShrinkage() {
			if (!this.isInline) {
				return;
			}
			this.$nextTick(() => {
				if (this.$refs.elForm) {
					const { clientWidth } = this.$refs.elForm.$el;
					let { width, marginRight } = window.getComputedStyle(this.$refs.elForm.$el.children[0]);
					width = parseInt(width) + parseInt(marginRight); // 一个表单元素实际占用的空间大小
					let max = Math.floor(clientWidth / width); // 一行可显示的最大数量
					this.onlyOneLine = this.$refs.elForm.$el.children.length <= max;
					// hideNumber 用于控制最少显示的行数
					let lineMax = Math.max(max * this.hideNumber, 2); // 一行的数量,至少显示一个+控制元素 = 2
					// todo with 有时候会拿不到

					let len = this.$refs.elForm.$el.children.length;
					for (let ind = 0; ind < len; ind++) {
						let item = this.$refs.elForm.$el.children[ind];
						if (item.className.indexOf('item-shrinkage') > -1) {
							continue;
						}
						let isShow = (!this.isOpen && ind < lineMax - 1) || this.isOpen;
						if (!this.preItemDisplayValue) {
							this.preItemDisplayValue = window.getComputedStyle(item).display;
						}
						item.style.display = isShow ? this.preItemDisplayValue : 'none';
					}
					// 设置操作按钮
					if (this.$refs['action-item']) {
						// 如果操作按钮独立占用了一行,设置transform
						let onlyOneLine = clientWidth - 20 <= this.$refs['action-item'].$el.clientWidth;
						let rightDis = onlyOneLine ? clientWidth - max * width + 6 : 0;
						this.shrinkageBtnStyle = {
							transform: `translateX(${-rightDis}px`,
							'text-align': onlyOneLine ? 'right' : 'left',
						};
						// 非单行下按钮的布局
						this.$refs['action-item'].$el.style['text-align'] = onlyOneLine ? 'right' : 'left';
					}
				}
			});
		},
	},
	created() {
		this.onSize = rafThrottle(this.setShrinkage);
	},
	destroyed() {
		CViewEventBus.$off('c-form-layout-update', this.setShrinkage);
		window.removeEventListener('resize', this.onSize);
	},
	mounted() {
		if (this.column && this.column.length) {
			this.setDefaultModel(this.column);
		}
		if (this.hideAction) {
			return;
		}
		CViewEventBus.$off('c-form-layout-update', this.setShrinkage);
		CViewEventBus.$on('c-form-layout-update', this.setShrinkage);
		this.setShrinkage();
		setTimeout(() => {
			// slot action  操作区域会有闪动，所以延迟显示
			this.showAction = true;
			this.onSize();
		}, 150);
		window.addEventListener('resize', this.onSize);
	},
};
</script>

<style scoped lang="scss">
$--color-primary: #296cde;
.toggle-btn {
	cursor: pointer;
	display: inline-block;
	line-height: 32px;
	color: $--color-primary;
	padding: 0 10px;
	margin-left: 10px;
}
.c-form.el-form--inline {
	display: flex;
	flex-wrap: wrap;
	::v-deep {
		.el-form-item {
			flex-shrink: 0;
		}
		.item-shrinkage {
			border-color: transparent !important;
			flex-grow: 1;
			margin-bottom: 0;
			text-align: right;
			//min-width: 140pxd !important;
			//margin-right: 0 !important;
		}
	}
}
::v-deep .action-container > div {
	display: inline-block;
}
.action-container {
	white-space: nowrap;
}
</style>
<style lang="scss">
.c-form .action-container .c-button {
	min-width: 64px;
}
</style>
