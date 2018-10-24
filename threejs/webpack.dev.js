const merge=require('webpack-merge');
const common=require('./webpack.common.js');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const webpack=require('webpack');
module.exports=merge(common,{
	mode:'development',
	devtool:'inline-source-map',
	devServer:{
		contentBase:'dist',
		hot:true
	},
	plugins:[
		new OpenBrowserPlugin({
			browser:'chrome'
		}),
		new webpack.HotModuleReplacementPlugin()
	]
});
