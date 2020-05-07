function Compile(vm) {
	this.vm = vm;
	this.el = vm.$el;
	this.fragment = null;
	this.init();
}

Compile.prototype = {
	init: function () {
		this.fragment = this.nodeFragment(this.el);
		this.compileNode(this.fragment);
		this.el.appendChild(this.fragment); //解析完成添加到元素中
	},
	nodeFragment: function (el) {
		const fragment = document.createDocumentFragment();
		let child = el.firstChild;
		//将子节点，全部移动文档片段里
		while (child) {
			fragment.appendChild(child);
			child = el.firstChild;
		}
		return fragment;
	},
	compileNode: function (fragment) {
		let childNodes = fragment.childNodes;
		[...childNodes].forEach(node => {
			let nodeAttrs = node.attributes; // 获取所有属性
			let nodeType = node.nodeType; // 获取标签类型
			let nodeName = node.nodeName; // 获取标签名
			const findVModel = nodeAttrs ? [ ...nodeAttrs ].find(item => item.name === 'v-model') : false
			// input且有v-model
			if(nodeName.toUpperCase() === 'INPUT' && findVModel) {
				this.compileModel(node, findVModel.value);
			}
			if(nodeType === 3) {
				let reg = /\{\{(.*)\}\}/;
				let text = node.textContent;
				if (reg.test(text)) {
					let prop = reg.exec(text)[1];
					this.compileText(node, prop); //替换模板
				}
			}
			//编译子节点
			if (node.childNodes && node.childNodes.length) {
				this.compileNode(node);
			}
		});
	},
	compileModel: function (node, prop) {
		new Watcher(this.vm, prop, (value) => {
			let val = this.vm._data[prop];
			this.updateModel(node, val);
		});
		
		node.addEventListener('input', e => {
			let newValue = e.target.value;
			this.vm._data[prop] = newValue;
		});
	},
	compileText: function (node, prop) {
		// this.updateView(node, text);
		new Watcher(this.vm, prop, (value) => {
			let text = this.vm._data[prop];
			this.updateView(node, text);
		});
	},
	
	updateModel: function(node, value) {
		node.value = typeof value == 'undefined' ? '' : value;
	},
	updateView: function (node, value) {
		node.textContent = typeof value === 'undefined' ? '' : value;
	},
	isDirective: function (attr) {
		return attr.indexOf('v-') !== -1;
	},
	
	isElementNode: function (node) {
		return node.nodeType === 1;
	},
	isTextNode: function (node) {
		return node.nodeType === 3;
	}
}
