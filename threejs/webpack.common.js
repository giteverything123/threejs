const path=require('path');
const htmlwebpackplugin=require('html-webpack-plugin');
const cleanwebpackplugin=require('clean-webpack-plugin');
module.exports={
	entry:{
		app:'./js/index.js'
	},
	output:{
		filename:'[name].[hash:8].js',
		chunkFilename:'[name].[hash:8].js',
		path:path.resolve(__dirname,'dist')
	},
	module:{
		rules:[
			{
				test:/\.css$/,
				use:['style-loader','css-loader']
			},
			{
				test:/\.(png|jpg)$/,
				use:['url-loader?limit=2048']
			},
		]
	}
	plugins:[
		new htmlwebpackplugin({
			title:'three',
			template:'./index.html'
		}),
		new cleanwebpackplugin(['dist'])
	],
}
