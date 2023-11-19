<script>
import { createApp } from 'vue'
import { h } from 'vue'
import { getGlobalComponent } from '@/utils/help'
function createElement(ctx) {
	const { prop, render, child, onEvent = {}, filterType, noVModel, ...attrs } = ctx.$attrs;
	function returnInputValue(event) {
		const val = (event || '').trim();
		return filterType === 'number' ? val.replace(/[^\d]/g, '') : val;
	}
	if (typeof render === 'string') {
    const props = {
      key: attrs.key,
      ...attrs,
      ...onEvent,
    }
    if(!noVModel) {
      props.modelValue = ctx.$props.form[prop]
      props['onUpdate:modelValue'] = (event) => ctx.$props.form[prop] = render === 'el-input' ? returnInputValue(event) : event
    }
		return h(
        getGlobalComponent(render),
        props,
			child && child.map((item) => createElement({ $attrs: item , $props: ctx.$props, noVModel: true }))
		);
	}
	return render(h, ctx.$props.form, ctx); // todo
}
export default {
	name: 'CFormRender',
	functional: true,
	props: {
		form: {
			type: Object,
			default: () => {},
		},
	},
	render: createElement,
};
</script>
