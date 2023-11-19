<script>
import { h } from 'vue'
import {getGlobalComponent} from "@/utils/help";
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
function createElement(ctx) {
	const { columnData = {}, data = [] } = ctx;
	const { render, label, prop, child, headerRender, opt = {} } = columnData;
	let scopedSlots = null;
	if (render || headerRender) {
		scopedSlots = {};
		if (render) {
			scopedSlots.default = (props) => render(h, props, data);
		}
		if (child) {
			scopedSlots.header = child && child.map((item) => createElement({ columnData: item, data}));
		}
	}
  const renderChild = (child||[]).map((item) => createElement({ columnData: item, data}))
	return h(
      getGlobalComponent('el-table-column'),
      {
        width: getW(columnData),
        minWidth: getMinW(columnData),
        'label-class-name': child ? 'is-merge' : '',
        ...opt,
        label,
        prop,
      },
      child ? renderChild: scopedSlots,
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
