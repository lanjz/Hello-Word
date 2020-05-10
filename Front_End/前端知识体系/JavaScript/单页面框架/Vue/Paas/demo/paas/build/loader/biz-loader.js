const fn = `registerComponent(require('../page/index.vue').default)`
module.exports = function (source) {
  const abc = source + ';\n' + fn
  console.log('source', abc)
  return abc
};
