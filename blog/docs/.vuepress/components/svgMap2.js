function getPadding(val) {
    if(!val) return [0, 0]
    val = (''+val).trim()
    val = val.split('')
    if(val.length === 1){
        let d = val[0] || 0
        return [d, d]
    }
    return [val[0] || 0, val[val.length - 1] || 0]
}
function getTranslate(val){
    if(!val) return { x: 0, y: 0 }
    let reg = /translate\(.*(\d+).*(\d+).*/g
    let result = reg.exec(val)
    if(result){
        return {
            x: result[1],
            y: result[2],
        }
    }
    return { x: 0, y: 0 }
}
function setTransform(el, key, value){
    if(!el) return
    let getValue = el.style.getPropertyValue('transform')
    if(!getValue){
        getValue = `${key}${value}`
    } else if(getValue.indexOf(key) < 0){
        getValue = `${getValue} ${key}${value}`
    } else {
       let reg = new RegExp("(?<="+key+")\\(.*?\\)", "g")
        getValue = getValue.replace(reg, value)
    }
    el.style.setProperty('transform', getValue)
}
/**
 * 判断滚轮方向
 * @return { boolean } true-向上; false-向下
 * */
function wheelDir(e) {
    e = e || window.event;
    if (e.wheelDelta) {
        if (e.wheelDelta>0) {
           return true
        }
        if (e.wheelDelta<0) {
            return false
        }
    } else if (e.detail) {
        if (e.detail > 0) {
            return false
        }
        if(e.detail<0){
            return true
        }
    }
}

function cContainer() {
    const div = document.createElement('div');
    return div
}
function cSvgDom() {
    const svgDom = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgDom.setAttribute('version','full');
    svgDom.setAttribute('baseProfile','baseProfile');
    // svgDom.setAttribute('style', `background: #272b2d`)
    svgDom.setAttribute('xmlns','http://www.w3.org/2000/svg');
    return svgDom
}
// 创建SVG-文本元素
/**
 * @params <String> txt : 文本
 * @params <Object> attr: 样式 { fill: '颜色', 'font-size': '文字大小', initY: 偏移高度}
 * */
function cText(txt, options = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg','text');
    let { padding = 0, initY, ...attr } = options
    let [pt, pl] = getPadding(padding)
    attr = {
        // dominantBaseline: 'bottom',
        x: pl,
        ...attr
    }
    Object.keys(attr).forEach(item => {
        el.setAttribute(item, attr[item]);
    })
    el.textContent = txt
    let rect = this.getRect(el)
    // svg无法知道文字高度，且文字基准线在底部，当文字出现时文字会向上偏移（偏移量为文字高度）
    el.setAttribute('transform', `translate(0, ${-rect.y})`);// 默认情况文本向偏上，不能垂直居中，所以纠正一下
    el.setAttribute('y', (+pt)+(initY||0));
    return el
}
// 创建SVG-元素
function cEl(tag, attr) {
    attr = {
        fill: '#000',
        y: attr.initY || 0,
        ...attr,
    }
    const el = document.createElementNS('http://www.w3.org/2000/svg',tag);
    Object.keys(attr).forEach(item => {
        el.setAttribute(item, attr[item]);
    })
    return el
}
// 创建组
function createGroup(attr = {}) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    Object.keys(attr).forEach(item => {
        g.setAttribute(item, attr[item]);
    })
    return document.createElementNS('http://www.w3.org/2000/svg', 'g')
}
// ----------------- //
function SvgMap(data, options = {}) {
    if(!data && typeof data !== 'object'){
        console.error('svgMap: 无效的数据源')
    }
}
/**
 * @params {Object<keys:label,key,children>} data: 数据源
 * options：
 * @property {String} title： 主题
 * @property {String <right, null>} direction： svg 延展方向, 默认为 null
 * @property {String} key： label的字段名，默认为 label
 * @property {String} name： keys 的字段名，默认为 key
 * @property {String} className： 赋加到 svg 上的类名
 * @property {Function} callback： 点击项后的回调函数
 * */
SvgMap.prototype.initState = function(data, options = {}) {
    const copyData = JSON.parse(JSON.stringify(data))
    const type = Object.prototype.toString.call(copyData)
    if(type === '[object Array]'){
        this.data = {
            label: options.title || 'Root',
            key: 'root',
            children: copyData
        }
    } else {
        this.data = copyData
        this.data.key = 'root'
    }
    this.direction = options.direction|| '' // right->只向右伸展 '' => 左右伸展
    this.keyName = options.key || 'key'
    this.lableName = options.name || 'label'
    this.callback = options.callback || null
    this.virtualSvg = {}
    // 主按钮样式
    this.rootStyle = {
        'font-size': '18px',
        color: '#fff',
        fill: 'transparent',
        padding: 0,
        'border-radius': '5',
        ...(options.rootStyle||{})
    }
    // rect样式
    this.rectStyle = {
        'font-size': '16px',
        color: '#fff',
        fill: '#a3c6c0',
        padding: 10,
        'border-radius': '5',
        ...(options.rectStyle||{})
    }
    // 连接线样式
    this.lineStyle = {
        color: this.rectStyle.color,
        width: 1,
        fill: 'transparent',
        ...(options.lineStyle||{})
    }
    // text样式
    this.textStyle = {
        'font-size': '16px',
        color: '#fff',
        ...(options.textStyle||{})
    }
    // 公共样式
    this.globalStyle = { // 文本样式
        verticalMargin: 20, // 元素上下间距
        rowMargin: 40, // 元素左右间距
    }
}
SvgMap.prototype.cText = cText
SvgMap.prototype.init = function (data, options) {
    this.initState(data, options)
    this.svgDom = cSvgDom()
    this.svgDom.that = this
    this.svgGroup = createGroup()
    this.svgDom.appendChild(this.svgGroup)
    document.body.appendChild(this.svgDom)
    const child = this.data.children || []
    let childRight, childLeft
    // 绘制右侧的元素
    if(!this.direction && child.length > 1){
        const half = Math.floor(child.length/2)
        // 一半存入left中，child存放其余部分了
        const left = child.splice(0, half)
        childLeft = this.initWalk(left, 'left')
        this.svgGroup.appendChild(childLeft)
    }
    // 绘制左侧的元素
    if(child.length > 0){
        childRight = this.initWalk(child)
        this.svgGroup.appendChild(childRight)
    }
    let centerY = ''
    // 连接中心点和右侧元素
    let {el: addRootLineRightGroup, enter: rightEnter} = this.drawRootLine(childRight)
    centerY = rightEnter.y
    this.svgGroup.appendChild(addRootLineRightGroup)
    if(!!childLeft){
        let {el: addRootLineGroup, enter: leftEnter} = this.drawRootLine(childLeft)
        this.svgGroup.appendChild(addRootLineGroup)
        addRootLineGroup.setAttribute('style', `transform: rotateY(180deg)`)
        // this.svgGroup 向右偏移,用以完整显示左边的元素
        setTransform(this.svgGroup, 'translateX', `(${this.getRect(addRootLineGroup).width}px)`)
        // 两边元素垂直居中
        let dis = (rightEnter.y - leftEnter.y)/2 // 获取差量
        if(rightEnter.y > leftEnter.y){
            addRootLineGroup.setAttribute('style', `transform: rotateY(180deg) translateY(${dis}px)`)
        } else {
            centerY = leftEnter.y
            addRootLineRightGroup.setAttribute('style', `transform: translateY(${dis})`)
        }
    }
    // 由于文字向上偏移将导致部分溢出,所以将this.svgGroup向下偏移溢出的部分
    setTransform(this.svgGroup, 'translateY', `(${Math.abs(this.getRect(this.svgGroup).y)}px)`)
    // 创建中点元素
    let RootG = this.createRootG()
    this.svgGroup.appendChild(RootG)
    this.svgDom.appendChild(this.svgGroup)
    // 将中点元素放在中心位置
    const { width: rootW, height: rootY} = this.getRect(RootG)
    RootG.setAttribute('transform', `translate(-${rootW/2}, ${centerY - rootY/2})`)
    const { width: svgW, height: svgH } = this.svgDom.getBBox()
    this.svgDom.setAttribute('width', svgW)
    this.svgDom.setAttribute('height', svgH)
    this.svgDom.remove()
    return this.svgDom
}
// 处理根元素
SvgMap.prototype.initWalk = function(tree, direction) {
    const gGroup = this.walk(tree, direction, true)
    return gGroup
}
SvgMap.prototype.walk = function (tree, direction, root) {
    const svgElArr = []
    let hei = 0 // 设置每个元素的偏移高度
    tree.forEach((item) => {
        let textOpt = {
            text: item[this.lableName],
            fill: this.rectStyle.color,
            'font-size': this.rectStyle['font-size'],
            initY: hei,
        }
        const rectOpt = {
            fill: this.rectStyle.fill,
            'rx': this.rectStyle['border-radius'],
            'ry': this.rectStyle['border-radius'],
            'padding': this.rectStyle.padding,
            initY: hei,
        }
        let svgEl = item.type === 'text' ? this.cWord(textOpt, rectOpt) : this.cReact(textOpt, rectOpt, direction)
        // 如果有子节点, 给当前 rect 右侧添加小圆圈
        if(item.children&&item.children.length){
            this.appendCircle(svgEl, direction)
        }
        // // 如果左侧的元素水平翻转
        if(direction === 'left'){
            svgEl.style.setProperty('transform-origin', `${this.getRect(svgEl).width/2}px ${this.getRect(svgEl).height/2}px`)
            setTransform(svgEl, 'rotateY', '(180deg)') // 使用方法设置,避免其它属性被覆盖
            // svgEl.style.setProperty('transform', `transform: rotateY(180deg)`)
        }
        if(item.children && item.children.length) { // 如果有子节点，则递归子节点后再与当前节点合并成一个大组
            const childSvgEl = this.walk(item.children, direction)
            svgEl = this.combineGroup(svgEl, childSvgEl, item)
        } else {
            this.addVirtualSvg(item, svgEl, null)
        }
        hei += ((this.getRect(svgEl)).height + this.globalStyle.verticalMargin)
        svgElArr.push(svgEl)
    })
    return this.createListGroup(svgElArr) // 返回组成G
}
SvgMap.prototype.appendCircle = function (cG, direction = 'right'){
    const { width, height, y } = this.getRect(cG)
    const circle = cEl('circle', {
        cx: direction === 'left' ? -5: width + 5,
        cy: y + height/2, // rect 的垂直偏移量 + rect 中间位置
        r: 5,
        fill: this.rectStyle.color,
        'stroke-width': 1,
    })
    cG.appendChild(circle)
}
/**
 * 根据 data 元素生成虚拟节点
 * @params { Object } node: 当前节点
 * @params { curDom } node: 当前节点对应的 svg dom
 * @params { childDom } node: 当前节点对应的子节点 dom
 * */
SvgMap.prototype.addVirtualSvg = function(node, curDom, childDom) {
    if(!this.virtualSvg[node[this.keyName]]){
        this.virtualSvg[node[this.keyName]] = {
            ...node,
            childDom: []
        }
    }
    if(childDom) {
        this.virtualSvg[node[this.keyName]].childDom.push(childDom)
    }
    if(curDom) {
        this.virtualSvg[node[this.keyName]].dom = curDom
    }
}
SvgMap.prototype.addEvent = function(){
    const _this = this
    this.svgDom.addEventListener('click', function (e) {
        const key = e.target.getAttribute('key') || ''
        if(e.target.tagName === 'circle') {
            _this.virtualSvg[key].hide = !_this.virtualSvg[key].hide
            _this.virtualSvg[key].childDom.forEach(item => {
                item.style.display = _this.virtualSvg[key].hide ? 'none' : 'block'
            })
            e.target.style.opacity = _this.virtualSvg[key].hide ? '.5' : '1'
        } else if(e.target.tagName === 'rect' || e.target.tagName === 'text'){
            _this.callback && _this.callback(_this.virtualSvg[key])
        }
    })
    this.svgDom.addEventListener('mousedown', _this.mousedown)
    this.svgDom.onmousewheel = this.wheel.bind(this)
}
SvgMap.prototype.wheel = function(e){
    if(wheelDir(e)) {
        this.scale += 0.1
    } else {
        this.scale -= 0.1
    }
    this.svgDom.style.setProperty('transform', `translate(${this.translateX }px, ${this.translateY}px) scale(${this.scale})`)
    e.preventDefault()
}
SvgMap.prototype.mousedown = function(e) {
    let _this = this.that
    _this.mousedown = true
    _this.mousedownMoveStartX = e.pageX
    _this.mousedownMoveStartY = e.pageY
    _this.svgDom.addEventListener('mousemove', _this.mousemove)
    _this.svgDom.addEventListener('mouseup', _this.mouseleave)
    _this.svgDom.addEventListener('mouseleave', _this.mouseleave)
}
SvgMap.prototype.mouseleave = function(e) {
    let _this = this.that
    _this.mousedown = false
    _this.translateX = _this.temTranslateX
    _this.translateY = _this.temTranslateY
    _this.svgDom.removeEventListener('mousemove', _this.mousemove)
    _this.svgDom.removeEventListener('mouseleave', _this.mouseleave)
    _this.svgDom.removeEventListener('mouseleave', _this.mouseleave)
}
SvgMap.prototype.mousemove = function(e) {
    let _this = this.that
    if(!_this.mousedown) return
    _this.positionX = (e.pageX - _this.mousedownMoveStartX)
    _this.positionY = (e.pageY - _this.mousedownMoveStartY)
    _this.temTranslateX = _this.positionX + _this.translateX
    _this.temTranslateY = _this.positionY + _this.translateY
    _this.svgDom.setAttribute('style', `transform: translate(${_this.temTranslateX}px, ${_this.temTranslateY}px) scale(${_this.scale})`)
}

/**
 * 获取元素几何信息，需要在DOM才能得到这些信息，所以先执行appendChild
 * 要注意appendChild后修改节点位置，所以切勿在插入到正确位置后再执行这个方法
 * */
SvgMap.prototype.getRect = function(g){
    if(document.body.contains(g)){
        let rect = g.getBBox()
        g.rect = rect
    } else if(g.rect){
        return g.rect
    } else {
        this.svgGroup.appendChild(g)
        let rect = g.getBBox()
        g.rect = rect
        g.remove()
    }
    return g.rect
}

/**
 *  获取子元素集合中的垂直居中位置
 *  g元素没有记录几何信息
 *  通过查找g元素下的非g元素，来获取当前g的垂直偏移量
 * */
SvgMap.prototype.findMiddlePosition =function(el){
    const firstEl = el.firstChild
    const {y: firstElY, height: firstH} = this.findPositionElY(firstEl)
    const lastEl = el.lastChild
    const {y: lastElY} = this.findPositionElY(lastEl)
    const result = (lastElY*1 + firstElY*1+firstH*1) / 2 //first的下边与last的上边的中间位置
    return result
}
// 获取某在元素在的Y偏移量
SvgMap.prototype.findPositionElY = function(el){
    while (el.tagName === 'g'){
        el = el.firstChild
    }
    return {
        y: el.getAttribute('y'),
        x: el.getAttribute('x'),
        width: el.getAttribute('width'),
        height: el.getAttribute('height'),
    }
}

/**
 * @params {g} right
 * @params {g} left 如果没有说明只有一侧
 * */
SvgMap.prototype.createRootG = function(){
    const textOptions = {
        text: this.data[this.lableName],
        fill: this.rootStyle.color,
        'font-size': this.rootStyle['font-size']
    }
    const rectOptions = {
        fill: this.rootStyle.fill,
        'rx': this.rootStyle['border-radius'],
        'ry': this.rootStyle['border-radius'],
        'padding': this.rootStyle.padding,
    }
    let rect = this.cReact(textOptions, rectOptions)
    return rect
}
/**
 * 创建SVG-ellipse元素
 * @params {Object} textOptions: 文字相关的配置
 * @params {Object} rectOptions: 矩形相关的配置
 * */
SvgMap.prototype.cReact = function(textOptions, rectOptions = {}) {
    const { text, ...txtOpt } = textOptions
    const { padding } = rectOptions
    const cG = createGroup()
    let sText = this.cText(text, { padding, ...txtOpt })
    let [pt, pl] = getPadding(padding)
    let rectWidth = sText.rect.width + (2 * pl)
    let rectHeight = sText.rect.height + (2 * pt)
    rectOptions = {
        x: 0,
        width: rectWidth,
        height: rectHeight,
        ...rectOptions
    }
    const rect = cEl('rect', rectOptions)
    cG.appendChild(rect)
    cG.appendChild(sText)
    return cG
}
/**
 * 创建文本类型的 svg 元素
 * */
SvgMap.prototype.cWord = function(textOptions, rectOptions = {}) {
    const { text, ...txtOpt } = textOptions
    const { padding } = rectOptions
    const cG = createGroup()
    let [pt, pl] = getPadding(padding)
    let sText = this.cText(text, { padding: `0 ${pl}`, ...txtOpt })
    rectOptions = {
        x: 0,
        width: sText.rect.width + (2 * pl),
        height: sText.rect.height + (2 * pt),
        ...rectOptions,
        fill: 'transparent'
    }
    const rect = cEl('rect', rectOptions)
    cG.appendChild(rect)
    cG.appendChild(sText)
    // 为了连线的时候整齐，跟普通rect一样连到中间的点，所以将文本上向偏移到中间位置
    setTransform(cG, 'translate', `(${getTranslate(sText).x}px, ${getTranslate(sText).y-12}px)`)
    cG.dataType = 'text'
    return cG
}
/**
 * @params {svg[g]} a 左侧的g元素
 * @params {svg[g]} b a对应的子元素
 * */
SvgMap.prototype.combineGroup = function(a, b, node) {
    const cG = createGroup()
    const {y: aY, width: aWidth, height: aHeight } = this.getRect(a) // 当前A的几何信息
    const bX = `${aWidth + this.globalStyle.rowMargin}` // 计算a,b的间距
    const middleByA = aHeight/2
    // const middleByGroup = this.getRect(b).height/2 // 这个方式取到的整体的中间值，这里需要的靠近a最近的那层的中间位置
    const middleByGroup = this.findMiddlePosition(b) // 计算a在b垂直方向的中间位置
    console.log('middleByGroup', middleByGroup)
    // 1. 将b放在a的右侧 且与a水平对齐
    b.setAttribute('transform', `translate(${bX}, ${aY})`) // g 没有 x y属性
    // 2. 在上一步对齐的基础上,将 a 放到 b 垂直居中的位置
    a.childNodes.forEach(node => {
        // console.log('node', node, node.rect)
        if(node.tagName === 'circle') {
            let curY = node.getAttribute('cy') * 1
            node.setAttribute('cy', middleByGroup+curY-middleByA) // （步骤A）相对b的居中位置 + 原本的偏移量
        } else {
            let curY = node.getAttribute('y') * 1
            node.setAttribute('y', middleByGroup+curY-middleByA) // （步骤A）相对b的居中位置 + 原本的偏移量
        }
    })
    cG.appendChild(a)
    cG.appendChild(b)
    this.addVirtualSvg(node,a, b)
    // 绘制连接线
    b.childNodes.forEach(item => {
        const {y: positionY, height} = this.findPositionElY(item) // 获取元素在当前组内的Y偏移量
        const M = `${aWidth} ${(aY + middleByGroup)}` // 起点 从父级rect 右侧垂直居中的位置
        const C1 = `${aWidth+20} ${(aY + middleByGroup)}` // 开始转弯的位置
        let endY = Number(positionY) + Number(aY)+height/2 // 结束时的 Y 位置
        const C2 = `${bX - 20} ${endY}` // 结束转弯的位置,子元素左侧位置
        let E = `${bX + 20} ${endY}`
        if(item.dataType === 'text'){ // 是文本元素
            E = E+` h ${this.getRect(item).width}` // 结束的位置
        }
        const line = cEl('path', {
            d: `M${M} C ${C1} ${C2} ${E}`,
            style: `stroke:${this.lineStyle.color}`,
            'stroke-width': this.lineStyle.width,
            stroke: this.lineStyle.color,
            fill: 'transparent'
        })
        this.virtualSvg[node[this.keyName]].childDom.push(line)
        cG.appendChild(line)
    })
    return cG
}
// 将同父的元素放同一个组中
SvgMap.prototype.createListGroup = function(svgElArr) {
    const cG = createGroup()
    svgElArr.forEach((item, ind) => {
        cG.appendChild(item)
    })
    return cG
}
SvgMap.prototype.drawRootLine = function(right) {
    const cG = createGroup()
    let rootX = 0
    let rootW = 0
    // 1. 将b放在a的右侧 且与a水平对齐
    right.setAttribute('transform', `translate(${this.globalStyle.rowMargin}, 0)`) // g 没有 x y属性
    const aHeight = this.findMiddlePosition(right) // 计算a在b垂直方向的中间位置
    const rootCenterX = 0
    const rootCenterY = aHeight
    const M = `${rootCenterX} ${rootCenterY}`
    right.childNodes.forEach(item => {
        const {y: itemY, height} = this.findPositionElY(item)
        const targetX = Number(rootX) +this.globalStyle.rowMargin + rootW
        const targetY = Number(itemY) + Number(height) / 2
        const Q = `${rootCenterX} ${targetY}`
        const E = `${targetX} ${targetY}`
        const line = cEl('path', {
            d: `M${M} Q ${Q} ${E}`,
            style: `stroke:${this.lineStyle.color}`,
            'stroke-width': this.lineStyle.width,
            stroke: this.lineStyle.color,
            fill: 'transparent'
        })
        cG.appendChild(line)
    })
    cG.appendChild(right)
    return {
        el: cG,
        enter: {
            x: rootCenterX,
            y: rootCenterY
        }
    }

}

function mapSvg(data, options) {
    return (new SvgMap(data, options)).init(data, options)
}
export default mapSvg