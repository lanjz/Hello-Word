<script>
function createElement(h, ctx) {
	const { render, form, column } = ctx.props;
	return render(h, form, column);
}
export default {
	name: 'CLabelRender',
	functional: true,
	props: {
		column: {
			type: Object,
			default: () => {},
		},
		form: {
			type: Object,
			default: () => ({}),
		},
		render: {
			type: Function,
		},
	},
	render: createElement,
};
</script>
