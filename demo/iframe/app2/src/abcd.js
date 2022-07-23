const _historyWrap = function(type) {
  const orig = history[type];
  const e = new Event(type);
  return function() {
    const rv = orig.apply(this, arguments);
    e.arguments = Array.from(arguments);
    window.dispatchEvent(e);
    return rv;
  };
};
history.pushState = _historyWrap('pushState');
history.replaceState = _historyWrap('replaceState');
// history.go = _historyWrap('go');
// history.back = _historyWrap('back');

window.addEventListener('pushState', function(e) {
  postMessageToTop('pushState', e.arguments)
});
window.addEventListener('replaceState', function(e) {
  console.log('replaceState,', e.arguments)
  postMessageToTop('replaceState', e.arguments)
});
/*window.addEventListener('go', function(e) {
  postMessageToTop('go', e.arguments)
});
window.addEventListener('back', function(e) {
  postMessageToTop('back', e.arguments)
});*/
window.addEventListener('popstate', function(e) {
  postMessageToTop('back', e.arguments)
});
function postMessageToTop(type, arg){
  const { pathname, hash, search, href, origin } = window.location
  window.top.postMessage(JSON.stringify({
    pathname,
    hash,
    search,
    type,
    fullPath: href.substring(origin.length),
    arg
  }), '*')
}
