<template>
	<el-select
		class="tree-select"
		@clear="clearDep"
		v-model="modelValue"
		v-bind="$attrs"
	>
		<div
			slot="empty"
			style="max-height: 300px; overflow: auto"
		>
			<el-tree
				:data="data"
				ref="refTree"
				:node-key="props.value || 'key'"
				:props="props"
				:default-expanded-keys="defaultExpandedKeys"
			>
				<span
					class="custom-tree-node"
					slot-scope="{ data }"
				>
					<span @click.stop=""
						><el-radio
							class="radio"
							v-model="result"
							:label="data[props.value || 'key']"
							>{{ data[props.label || 'label'] }}</el-radio
						></span
					>
				</span>
			</el-tree>
		</div>
	</el-select>
</template>

<script>
export default {
	name: 'select-tree-single',
	props: {
		data: Array,
		value: String,
		props: {
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			result: this.value || '',
			modelValue: '',
			defaultExpandedKeys: [this.value],
		};
	},
	watch: {
		result: function () {
			this.$emit('input', this.result);
			this.getModelValue();
		},
		value() {
			this.result = this.value;
		},
	},
	methods: {
		clearDep() {
			this.result = '';
		},
		getModelValue() {
			if (!this.result || !this.$refs.refTree) {
				this.modelValue = '';
				return;
			}
			let curNode = this.$refs.refTree.getNode(this.result);
			if (curNode) {
				this.modelValue = curNode.data.name;
			} else {
				this.modelValue = '';
			}
		},
	},
	mounted() {
		this.getModelValue();
	},
};
</script>

<style scoped lang="scss"></style>
