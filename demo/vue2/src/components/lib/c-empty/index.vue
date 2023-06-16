<template>
	<div
		class="empty"
		:style="styleObj"
	>
		<img
			:width="imgSize || 180 + 'px'"
			src="./no_content.png"
		/>
		<span>{{ showText }}</span>
	</div>
</template>

<script>
export default {
	name: 'c-empty',
	props: ['text', 'type', 'top', 'imgSize'],
	computed: {
		showText() {
			if (this.text) {
				return this.text;
			}
			return this.type === 'result' ? '搜索无相关内容' : '暂无相关内容';
		},
		styleObj() {
			return {
				paddingTop: (this.top || 40) + 'px',
			};
		},
	},
};
</script>

<style scoped>
.empty {
	text-align: center;
	color: #56606c;
}
img {
	display: block;
	margin: 0 auto;
}
span {
	font-size: 12px;
	display: inline-block;
	line-height: 12px;
}
</style>
