<template>
	<el-dropdown
		class="operate-wrap"
		size="small"
		placement="top-start"
		:hide-on-click="false"
		v-if="visible && group"
	>
		<i
			class="el-icon-more"
			v-if="showIcon"
		/>
		<span v-else>更多 <i class="el-icon-arrow-down"></i></span>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item
				v-for="(item, index) in group"
				@click.native="handleClick(item.code, item)"
				:key="item.key"
				:divided="group.length > 1 && index !== 0 ? true : false"
			>
				{{ item.text }}
			</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
	<el-tooltip
		:disabled="!tip"
		class="item"
		effect="dark"
		:content="tip"
		placement="top-start"
		v-else-if="visible && !group"
	>
		<span
			@click="handleClick()"
			:class="['operate-wrap', type]"
		>
			<i
				:class="iconCode"
				v-if="showIcon"
			/>
			<span v-if="text">
				{{ text }}
			</span>
		</span>
	</el-tooltip>
</template>

<script>
let iMap = {
	edit: 'el-icon-edit',
	look: 'el-icon-view',
	del: 'el-icon-delete',
	tool: 'el-icon-s-tools',
};
export default {
	name: 'operate-item',
	props: {
		isAuth: Boolean,
		auth: {},
		type: {
			type: String,
			default: () => 'edit',
		},
		icon: {
			type: String,
		},
		text: {
			type: String,
		},
		showIcon: {
			type: Boolean,
			default: () => false,
		},
		tip: {
			type: String,
			default: () => '',
		},
		code: {
			type: String,
			default: () => '',
		},
		group: [Array],
	},
	computed: {
		isDev() {
			// return false
			return process.env.NODE_ENV === 'development';
		},
		visible() {
			return this.isDev || !this.isAuth || (this.isAuth && !!this.auth);
		},
		iconCode() {
			return this.icon || iMap[this.type];
		},
	},
	methods: {
		handleClick(evt, item) {
			this.$emit('click', evt || this.code, item);
		},
	},
};
</script>

<style lang="scss" scoped>
.operate-wrap {
	outline: none;
	cursor: pointer;
	display: inline-block;
	color: $--color-primary;
	position: relative;
	font-size: 13px;
	padding: 0 10px;
	&:first-child {
		padding-left: 0;
	}
	&:not(:last-child):after {
		content: '';
		position: absolute;
		right: 0;
		background: #c1c5ca;
		top: 50%;
		transform: translateY(-50%);
		height: 10px;
		width: 1px;
	}
	i {
		margin-right: 2px;
	}
}
</style>
