<script>
function createElement(h, ctx, noVModel) {
	const { prop, render, child, onEvent = {}, filterType, ...attrs } = ctx.data.attrs;
	function returnInputValue(event) {
		const val = (event || '').trim();
		return filterType === 'number' ? val.replace(/[^\d]/g, '') : val;
	}
	if (typeof render === 'string') {
		return h(
			render,
			{
				props: !noVModel ? { value: ctx.props.form[prop] } : {}, // 根据 noVModel 是否添加 V-MODEL 语法糖
				on: !noVModel
					? {
							input: function (event) {
								ctx.props.form[prop] = render === 'el-input' ? returnInputValue(event) : event;
							},
							...onEvent,
					  }
					: { ...onEvent },
				attrs,
				key: attrs.key,
			},
			child && child.map((item) => createElement(h, { data: { attrs: item }, props: ctx.props }, true))
		);
	}
	return render(h, ctx.props.form, ctx.data.attrs);
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
