function Mvue(options, prop) {
	this.$options = options;
	this.$data = options.data;
	this.$prop = prop;
	this.$el = document.querySelector(options.el);
	this.init();
}
Mvue.prototype.init = function () {
	new Observer(this.$data);
	new Compile(this);
}
