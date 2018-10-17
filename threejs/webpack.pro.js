const merge=require('webpack-merge');
const common=require('./webpack.common.js');
const uglifyjsplugin=require('uglifyjs-webpack-plugin');
module.exports=merge(common,{
	mode:'production',
	devtool:'source-map',
	plugins:[
		new uglifyjsplugin({
			sourceMap:true
		}),
	]
});