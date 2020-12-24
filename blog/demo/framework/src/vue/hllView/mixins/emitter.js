function _broadcast(componentAlias, eventName, params) {
  this.$children.forEach(function (child) {
    var name = child.$options.componentAlias;

    if (name === componentAlias) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      _broadcast.apply(child, [componentAlias, eventName].concat([params]));
    }
  });
}
exports.default = {
  methods: {
    hllDispatch: function hllDispatch(componentAlias, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentAlias;

      while (parent && (!name || name !== componentAlias)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentAlias;
        }
      }

      if (parent) {

        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    hllBroadcast: function hllBroadcast(componentAlias, eventName, params) {
      _broadcast.call(this, componentAlias, eventName, params);
    }
  }
};