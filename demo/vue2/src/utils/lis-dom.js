function fixEvent(event) {
    if (event) {
        event.preventDefault = fixEvent.preventDefault;
        event.stopPropagation = fixEvent.stopPropagation;
        event._getPath = fixEvent._getPath;
    }
    return event;
}
fixEvent._getPath = function() {
    var ev = this;
    return this.path || (this.composedPath && this.composedPath()) || ry(ev.target).getParents();
};
function handle(e){
    e._getPath = fixEvent._getPath;
    if (!isPageCollect) return false;
    var ev = e || window.event;
    if (!ev) {
        return false;
    }
    var target = ev.target || ev.srcElement;
    if (typeof target !== 'object') {
        return false;
    }
    if (typeof target.tagName !== 'string') {
        return false;
    }
    var tagName = target.tagName.toLowerCase();
    if (tagName === 'body' || tagName === 'html') {
        return false;
    }
    if (!target || !target.parentNode || !target.parentNode.children) {
        return false;
    }
    var parent_ele = target.parentNode.tagName.toLowerCase();
    if (parent_ele === 'a' || parent_ele === 'button') {
        that.start(ev, target.parentNode, parent_ele);
    } else {
        that.start(ev, target, tagName);
    }
}

document.addEventListener('click', handle, true)