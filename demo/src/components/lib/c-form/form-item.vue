<template>
	<el-form-item
		v-bind="column.itemFormAttr"
		:prop="column.prop"
		:label="column.label"
		:class="formItemClass"
	>
		<template v-if="column.renderLabel">
			<span slot="label">
				<renderLabel
					:render="column.renderLabel"
					:form="form"
					:column="column"
				/>
			</span>
		</template>
		<template v-if="column.renderList">
			<el-col
				:span="c.colSpan || 24"
				v-for="(c, ind) in column.renderList"
				:key="ind"
			>
				<render
					:form="form"
					:disabled="formAttrs.disabled || c.disabled"
					v-bind="c"
				/>
			</el-col>
		</template>
		<el-col
			:span="column.colSpan || 24"
			v-else
		>
			<render
				:form="form"
				:disabled="formAttrs.disabled || column.disabled"
				v-bind="column"
			/>
		</el-col>
	</el-form-item>
</template>

<script>
import Render from './render';
import renderLabel from './renderLabel';

export default {
	name: 'FormItem',
	props: {
		column: {
			type: Object,
			default: () => ({}),
		},
		form: {
			type: Object,
			default: () => ({}),
		},
		formAttrs: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			isList: Object.prototype.toString.call(this.column) === '[object Array]',
		};
	},
	computed: {
		formItemClass() {
			let res = 'c-f-i';
			if (typeof this.column.render === 'string') {
				res += `-${this.column.render}`;
			}
			if (res && this.column.type) {
				res += `-${this.column.type}`;
			}
			return res;
		},
	},
	components: {
		Render,
		renderLabel,
	},
};
</script>

<style scoped></style>
