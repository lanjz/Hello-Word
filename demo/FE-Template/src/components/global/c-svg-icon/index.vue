<template>
	<div
		v-if="isExternal"
		:style="styleExternalIcon"
		class="svg-external-icon svg-icon"
		v-bind="$attrs"
	/>
  <i
      class="iconfont"
      :class="iconName"
      v-bind="$attrs"
      :style="{color}"
      v-else-if="isFont"
  />
	<svg
		v-else
		:class="svgClass"
		aria-hidden="true"
    v-bind="$attrs"
	>
		<use :href="iconName" />
	</svg>
</template>

<script>
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}
export default {
	name: 'CIcon',
	props: {
		name: {
			type: String,
			required: true,
		},
		className: {
			type: String,
			default: '',
		},
    color: {
      type: String,
      default: '',
    },
    isFont: Boolean
	},
	computed: {
		isExternal() {
			return isExternal(this.name);
		},
		iconName() {
			return this.isFont ? this.name : `#icon-${this.name}`;
		},
		svgClass() {
			if (this.className) {
				return 'svg-icon ' + this.className;
			} else {
				return 'svg-icon';
			}
		},
		styleExternalIcon() {
			return {
				mask: `url(${this.name}) no-repeat 50% 50%`,
				'-webkit-mask': `url(${this.name}) no-repeat 50% 50%`,
			};
		},
	},
};
</script>

<style scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}

.svg-external-icon {
	background-color: currentColor;
	mask-size: cover !important;
	display: inline-block;
}
.iconfont{
  color: #222
}
</style>
