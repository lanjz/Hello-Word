<template>
	<div>
		<OperateItem
			v-for="item in items"
			:key="item.code"
			:text="item.text"
			v-bind="item"
			@click="handleClick(item.code, item)"
		/>
		<OperateItem
			v-if="dropdownList.length"
			:group="dropdownList"
			:showIcon="items[0].showIcon"
			@click="(code, item) => handleClick(code, item)"
		/>
	</div>
</template>

<script>
import OperateItem from '../operate-item';
export default {
	name: 'operate-group',
	props: {
		group: {
			type: Array,
			default: () => [],
		},
	},
	components: {
		OperateItem,
	},
	computed: {
		items() {
			return this.group.slice(0, 3);
		},
		dropdownList() {
			return this.group.slice(3).filter((item) => !item.isAuth || (item.isAuth && !!item.auth));
		},
	},
	methods: {
		handleClick(code, item) {
			this.$emit('click', code, item);
		},
	},
};
</script>

<style lang="scss" scoped>
.icon-operate-btn {
	cursor: pointer;
	display: inline-block;
	color: #56606c;
	position: relative;
	&:not(:last-child) {
		margin-right: 15px;
	}
}
.more {
	color: #000;
}
</style>
<style scoped lang="scss">
/*  .look, .edit{
    color: #56606C;
  }

  .del{
    color: $--color-danger;
  }
  .warning{
    color: $--color-warning;
  }*/
</style>
