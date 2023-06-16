<template>
	<el-button
		size="small"
		v-bind="$attrs"
		v-on="$listeners"
	>
		<slot></slot>
	</el-button>
</template>

<script>
export default {
	name: 'c-button',
};
</script>

<style scoped></style>
