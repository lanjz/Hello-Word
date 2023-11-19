<template>
	<div class="tag-wrap">
		<div
			class="tag-item"
			:class="{ act: item.value === actValue }"
			v-for="item in list"
			:key="item.value"
			@click="handle(item)"
		>
			{{ item.label }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'c-tags',
	props: {
		list: {
			default: () => [],
		},
		value: {
			default: () => '',
		},
		disabled: Boolean,
		switchBefore: Function,
		switchAfter: Function,
	},
	data() {
		return {
			actValue: '',
		};
	},
	watch: {
		value: {
			handler: function (val) {
				this.actValue = val;
			},
			immediate: true,
		},
	},
	methods: {
		async handle(item) {
			if (this.disabled) return;
			let res = this.switchBefore ? await this.switchBefore(this.actValue) : true;
			if (res) {
				// this.actValue = item.value;
				this.$emit('input', item.value);
			}
		},
	},
};
</script>

<style scoped lang="scss">
.tag-wrap {
	border-bottom: solid 1px #8c939d;
	display: flex;
}
.tag-item {
	height: 50px;
	line-height: 50px;
	padding: 0 20px;
	position: relative;
	cursor: pointer;
	&.act {
		color: $--color-primary;
	}
	&.act:after {
		content: '';
		position: absolute;
		background: $--color-primary;
		height: 2px;
		width: 100%;
		bottom: -1px;
		left: 0;
	}
}
</style>
