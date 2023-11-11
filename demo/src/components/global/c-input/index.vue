<template>
	<div>
		<el-input
			type="text"
			:value="number"
			placeholder="请输入内容"
			@input="filter"
		>
		</el-input>
	</div>
</template>

<script>
export default {
	name: 'c-input',
	props: {
		value: {
			type: [String, Number],
			default: '',
		},
		hasPoint: {
			type: Boolean,
			default: false,
		},
		decimal: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			number: this.value,
		};
	},
	watch: {
		value: function () {
			this.number = this.value;
		},
	},
	methods: {
		filter(event) {
			const int = new RegExp(`^-?[0-9]*$`);
			const float = new RegExp(`^-?[0-9]*\\.?[0-9]{0,${this.decimal}}$`);
			if ((!this.hasPoint && int.test(event)) || (this.hasPoint && float.test(event))) {
				this.number = event;
			}
			this.$emit('input', this.number);
		},
	},
};
</script>

<style></style>
