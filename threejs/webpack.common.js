const path=require('path');
const glob=require('glob');
const htmlwebpackplugin=require('html-webpack-plugin');
const cleanwebpackplugin=require('clean-webpack-plugin');

let entrys=(()=>{
	let result={};
	let pathArr=['./03/**/*.js'];
	let pathReg=/^\.\/\d{2}\/\d{2}-\d{2}\/\d{2}-\d{2}\.js$/;
	pathArr.forEach((pathItem)=>{
		glob.sync(pathItem).forEach((entry)=>{
			if(entry.match(pathReg)){
				var nameReg=/\d{2}-\d{2}(?=\.js)/;
				var name=entry.match(nameReg)[0];
				result[name]=entry;
			}
		});
	});
	return result;
})();
// console.log(entrys);
let htmlOutputs=(()=>{
	let result=[];
	let pathArr=['./03/**/*.html'];
	let pathReg=/^\.\/\d{2}\/\d{2}-\d{2}\/index\.html$/;
	pathArr.forEach((pathItem)=>{
		glob.sync(pathItem).forEach((entry)=>{
			if(entry.match(pathReg)){
				var filenameReg=/\d{2}-\d{2}(?=\/index\.html)/;
				var filename=entry.match(filenameReg)[0]+'.html';
				var chunkname=entry.match(filenameReg)[0];
				result.push(new htmlwebpackplugin({
					template:entry,
					filename:filename,
					chunks:[chunkname]
				}));
			}
		});
	});
	return result;
})();

// console.log(entrys);
entrys['three']='./js/three';
module.exports={
	entry:entrys,
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
			{
				test:/\.js$/,
				exclude:/(node_modules)/,
				use:{loader:'babel-loader'}
			}
		]
	},
	plugins:[
		...htmlOutputs,
		new cleanwebpackplugin(['dist'])
	],
}
