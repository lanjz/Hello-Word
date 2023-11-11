<script>
function getW(item) {
	if (item.width) return item.width;
}
function getMinW(item) {
	if (item.minWidth) return item.minWidth;
	if (!item.label) return undefined;
	let wl = 0;
	let znl = 0;
	for (let i of item.label) {
		if (/\w/.test(i)) {
			wl++;
		} else {
			znl++;
		}
	}
	return Math.max(znl * 15 + wl * 9 + 35, 100);
}
function createElement(h, ctx) {
	const { columnData = {}, data = [] } = ctx.props;
	const { render, label, prop, child, headerRender, opt = {} } = columnData;
	let scopedSlots = null;
	if (render || headerRender) {
		scopedSlots = {};
		if (render) {
			scopedSlots.default = (props) => render(h, props, data);
		}
		if (headerRender) {
			scopedSlots.header = (props) => headerRender(h, props, data);
		}
	}
	return h(
		'el-table-column',
		{
			attrs: {
				width: getW(columnData),
				minWidth: getMinW(columnData),
				'label-class-name': child ? 'is-merge' : '',
				...opt,
				label,
				prop,
			},
			scopedSlots,
		},
		child && child.map((item) => createElement(h, { props: { columnData: item, data } }, true))
	);
}
export default {
	name: 'CTableRenderColumn',
	functional: true,
	props: {
		columnData: {
			type: Object,
			default: () => {},
		},
		data: {
			type: Array,
			default: () => {},
		},
	},
	render: createElement,
};
</script>
