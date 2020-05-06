function Mvue(options) {
	this._data = options.data;
	this.$el = document.querySelector(options.el);
	this.init();
}
Mvue.prototype.init = function () {
	new Observer(this._data);
	new Compile(this);
}
