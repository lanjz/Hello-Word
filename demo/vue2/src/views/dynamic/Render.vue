<script>
function createElement(h, ctx) {
  console.log('ctx', ctx)
  const { render, child, ...prop } = ctx.props.meta;
  if (typeof render === 'string') {
    return h(
        render,
        {
          props: prop,
        },
        child && child.map((item) => createElement(h, { data: { attrs: item }, props: ctx.props }, true))
    );
  }
  return render(h, ctx);
}
export default {
  name: 'render',
  functional: true,
  props: {
    meta: {
      type: Object,
      default: () => {},
    },
  },
  render: createElement,
};
</script>
