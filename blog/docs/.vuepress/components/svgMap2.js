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
    el.rect = this.getRect(el)
    // svg无法知道文字高度，且文字基准线在底部，当文字出现时文字会向上偏移（偏移量为文字高度）
    el.setAttribute('y', Math.abs(el.rect.y)+(+pt)+(initY||0));
    return el
}
// 创建SVG-元素
function cEl(tag, attr) {
    attr = {
        fill: '#000',
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
SvgMap.prototype.init = function (data, options) {
    this.initState(data, options)
    this.svgDom = cSvgDom()
    this.svgDom.that = this
    this.svgGroup = createGroup()
    this.svgDom.appendChild(this.svgGroup)
    document.body.appendChild(this.svgDom)
    let childRight = this.initWalk(this.data.children)
    console.log('childRight', childRight)
    this.createRootG() // 创建中点元素
    this.svgDom.appendChild(childRight)
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
        const config = {
            direction,
            hasChild: item.children&&item.children.length,
            key: item[this.keyName],
            type: item.type || ''
        }
        let svgEl = this.cReact(textOpt, rectOpt, config) // 返回某个文本G
        if(item.children && item.children.length) { // 如果有子节点，则递归子节点后再与当前节点合并成一个大组
            const childSvgEl = this.walk(item.children, direction)
            svgEl = this.combineGroup(svgEl, childSvgEl, item)
        } else {
            this.addVirtualSvg(item, svgEl, null)
        }
        hei += ((this.getRect(svgEl)).height + this.globalStyle.verticalMargin)
        svgElArr.push(svgEl)
        console.log('svgElArr', svgElArr)
        if(root) {
            this.addVirtualSvg(this.data, this.svgGroup, svgEl)
        }
        //
    })
    return this.createListGroup(svgElArr) // 返回组成G
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
SvgMap.prototype.cText = cText
/**
 * 获取元素几何信息，需要在DOM才能得到这些信息，所以先执行appendChild
 * 要注意appendChild后修改节点位置，所以切勿在插入到正确位置后再执行这个方法
 * */
SvgMap.prototype.getRect = function(g){
    this.svgGroup.appendChild(g)
    let rect = g.getBBox()
    g.remove()
    return rect
}

/**
 *  获取子元素集合中的垂直居中位置
 *  g元素没有记录几何信息
 *  通过查找g元素下的非g元素，来获取当前g的垂直偏移量
 * */
SvgMap.prototype.findMiddlePosition =function(el){
    const firstEl = el.firstChild
    const {y: firstElY} = this.findPositionElY(firstEl)
    const lastEl = el.lastChild
    const {y: lastElY} = this.findPositionElY(lastEl)
    const result = (lastElY - firstElY*1) / 2 + firstElY*1
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
SvgMap.prototype.createRootG = function(right, left){
    const textOptions = {
        text: this.data.label,
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
    this.svgGroup.appendChild(rect)
}
SvgMap.prototype.createRootG2 = function(right, left){
    // 创建 title 元素
    const rightMiddleY = right ? this.findMiddlePosition(right) : 0
    const leftMiddleY = left ? this.findMiddlePosition(left) : 0
    // 中心按钮的X偏移量：如果有left就放在left右侧
    let rootX = 0
    if(left || right){
        rootX = left ? left.getBBox().width + this.reactStyle.rowMargin : this.reactStyle.rowMargin
    }
    // 计算高的那个中间值
    const rootY = Math.max(rightMiddleY, leftMiddleY)
    const fontStyle = `font-size: 18px;`
    const rootG = this.cReact(
      { text: this.data[this.lableName], style: fontStyle },
      { y: rootY, x: rootX, fill: '#eade98', rx: 20, ry: 20 },
      { key: this.data[this.keyName] }
    )
    // this.addVirtualSvg(this.data, rootG, right)
    // this.addVirtualSvg(this.data, null, left)
    this.svgDom.appendChild(rootG)
    
    if(right) {
        const rootBox = rootG.getBBox()
        // 矮的那个也要放在高的垂直居中位置（当存在left时才需要计算）
        const minEl = left && (leftMiddleY <= rightMiddleY) ? left : right
        const rightY = left ? rootY - this.findMiddlePosition(minEl) : 0
        if(minEl === left) {
            // 水平翻转
            left.setAttribute('style', `transform: translate(${left.getBBox().width}px, ${rightY}px) rotateY(180deg)`)
            right.setAttribute('transform', `translate(${Number(rootBox.x)+Number(rootBox.width)+this.reactStyle.rowMargin}, 0)`)
        } else {
            left.setAttribute('style', `transform: translate(${left.getBBox().width}px, 0) rotateY(180deg)`)
            right.setAttribute('transform', `translate(${Number(rootBox.x)+Number(rootBox.width)+this.reactStyle.rowMargin}, ${rightY})`)
        }
        this.drawLine(rootG, right, left, minEl, rightY)
    }
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
    rectOptions = {
        x: 0,
        y: 0,
        width: sText.rect.width + (2 * pl),
        height: sText.rect.height + (2 * pt),
        ...rectOptions
    }
    const rect = cEl('rect', rectOptions)
    cG.appendChild(rect)
    cG.appendChild(sText)
    return cG
}
/**
 * 创建SVG-ellipse元素
 * @params {Object} textOptions: 文字相关的配置
 * @params {Number} height: 垂直偏移量
 * @params {Object} config: 其它属性
 * */
SvgMap.prototype.cReact2 = function(textOptions, rectOptions = {}, config) {
    const {text, ...txtOpt} = textOptions
    const {direction, key, ...conf} = config
    const { textPadding, reactRadius, minWidth } = this.reactStyle
    const cG = createGroup()
    let sText = this.cText(
        text,
      {
          y: rectOptions.y || 0,
          x: rectOptions.x || 0,
          key,
          fillColor: txtOpt.type !== 'text' ? this.primaryColor : this.bgColor ,
          ...txtOpt,
          ...conf
      }
    )
    cG.appendChild(sText)
    const {width, height} = this.getRect(cG)
    sText.setAttribute('transform', `translate(${textPadding}, ${height})`);// 默认情况文本向偏上，不能垂直居中，所以纠正一下
    const attr = {
        x: 0,
        y: 0,
        width: Math.max((width + textPadding * 2), minWidth),
        height: height + textPadding,
        rx: reactRadius,
        ry: reactRadius,
        key,
        ...rectOptions,
        ...conf
    }
    const sEllipse = cEl('rect', attr)
    if(config.type === 'text') {
        sText.setAttribute('transform', `translate(${textPadding}, ${height/2})`);// 默认情况文本向偏上，不能垂直居中，所以纠正一下
        const underLine = cEl('line', {
            x1: rectOptions.x || 0,
            y1: (rectOptions.y || 0) + this.getRect(sEllipse).height/2,
            x2: width + textPadding * 2,
            y2: (rectOptions.y || 0) + this.getRect(sEllipse).height/2,
            'stroke-width': 1,
            stroke: this.primaryColor
        })
        cG.appendChild(underLine)
    } else if(config.hasChild){
        const circle = cEl('circle', {
            cx: direction === 'left' ? (rectOptions.x || 0) - 5:(rectOptions.x || 0) + this.getRect(sEllipse).width+5,
            cy: (rectOptions.y || 0) + this.getRect(sEllipse).height/2,
            r: 5,
            fill: this.primaryColor,
            'stroke-width': 1,
            key
        })
        cG.appendChild(circle)
    }
    cG.prepend(sEllipse)
    if(direction === 'left'){
        cG.setAttribute('style', `transform: translateX(${Math.max((width + textPadding * 2), minWidth)}px) rotateY(180deg)`)
    }
    return cG
}
/**
 * @params {svg[g]} a 左侧的g元素
 * @params {svg[g]} b a对应的子元素
 * */
SvgMap.prototype.combineGroup = function(a, b, node) {
    const cG = createGroup()
    const x = `${this.getRect(a).width + this.globalStyle.rowMargin}` // 计算a,b的间距
    const y = this.findMiddlePosition(b) // 计算a在b垂直方向的中间位置
    const {y: aY, width: aWidth, height: aHeight } = this.getRect(a) // 当前A的几何信息
    b.setAttribute('transform', `translate(${x}, ${aY})`) // b的整体Y偏移要与a元素保持一致
    a.childNodes.forEach(node => {
        if(node.tagName === 'circle') {
            node.setAttribute('cy', y+aY + aHeight/2) // （步骤A）相对b的居中位置 + 原本的偏移量
        } else {
            node.setAttribute('y', y+aY) // （步骤A）相对b的居中位置 + 原本的偏移量
        }
    })

    cG.appendChild(a)
    cG.appendChild(b)
    this.addVirtualSvg(node,a, b)
    // 画线
    b.childNodes.forEach(item => {
        const {y: positionY, height} = this.findPositionElY(item) // 获取元素在当前组内的Y偏移量
        const M = `${aWidth} ${(aY + y) + aHeight/2}`
        const C1 = `${aWidth+20} ${(aY + y) + aHeight/2}`
        const C2 = `${x-20} ${Number(positionY) + Number(aY)+height/2}`
        const E = `${x} ${Number(positionY) + Number(aY)+height/2}`
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

SvgMap.prototype.drawLine = function(root, right, left, minEl, rightY = 0) {
    const { x: rootX, y: rootY, width: rootW, height: rootH } = root.getBBox()
    const rootCenterX = Number(rootX) + Number(rootW) / 2
    const rootCenterY = Number(rootY) + Number(rootH) / 2
    const M = `${rootCenterX} ${rootCenterY}`
    if(left) {
        left.childNodes.forEach(item => {
            const {y: itemY, height} = this.findPositionElY(item)
            const targetX = Number(rootX) - this.reactStyle.rowMargin
            const targetY = Number(itemY) + Number(height) / 2 + ((minEl === left) ? rightY : 0)
            const Q = `${rootCenterX} ${targetY}`
            const E = `${targetX} ${targetY}`
            const line = cEl('path', {
                d: `M${M} Q ${Q} ${E}`,
                ...this.lineStyle
            })
            this.svgGroup.appendChild(line)
        })
    }
    right.childNodes.forEach(item => {
        const {y: itemY, height} = this.findPositionElY(item)
        const targetX = Number(rootX) +this.reactStyle.rowMargin + rootW
        const targetY = Number(itemY) + Number(height) / 2 + ((minEl === right) ? rightY : 0)
        const Q = `${rootCenterX} ${targetY}`
        const E = `${targetX} ${targetY}`
        const line = cEl('path', {
            d: `M${M} Q ${Q} ${E}`,
            ...this.lineStyle
        })
        this.svgGroup.appendChild(line)
    })
}

function mapSvg(data, options) {
    return (new SvgMap(data, options)).init(data, options)
}
export default mapSvg