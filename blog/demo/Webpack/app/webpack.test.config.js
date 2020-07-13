const merge = require('webpack-merge');
const webpack = require('webpack')
const common = require('./webpack.common.test');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
// const dashboard = new Dashboard();
// const Jarvis = require("webpack-jarvis")
const config = (env) => {
	return merge(common(env), {
		mode: 'development',
		// devtool: 'inline-source-map',
	})
}
module.exports = config