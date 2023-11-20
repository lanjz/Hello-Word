<script>
function createElement(h, ctx) {
	const { render, scope, data } = ctx.props;
	return render(h, scope, data);
}
export default {
	name: 'CTableRender',
	functional: true,
	props: {
		scope: {
			type: Object,
			default: () => {},
		},
		data: {
			type: Array,
			default: () => {},
		},
		render: {
			type: Function,
			default: () => function () {},
		},
	},
	render: createElement,
};
</script>
