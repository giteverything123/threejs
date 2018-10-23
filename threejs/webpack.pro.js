const merge=require('webpack-merge');
const common=require('./webpack.common.js');
const uglifyjsplugin=require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports=merge(common,{
	mode:'production',
	devtool:'source-map',
	plugins:[
		new uglifyjsplugin({
			sourceMap:true
		}),
		new BundleAnalyzerPlugin({
			analyzerMode:'server',
			analyzerPort:8888,	
			openAnalyzer:false
		})
	]
});
