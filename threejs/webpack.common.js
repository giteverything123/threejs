const path=require('path');
const glob=require('glob');
const htmlwebpackplugin=require('html-webpack-plugin');
const cleanwebpackplugin=require('clean-webpack-plugin');
let htmlOutputs=(()=>{
	let result=[];
	let pathArr=['./01/**/*.html'];
	let pathReg=/^\.\/\d{2}\/\d{2}-\d{2}\/index\.html$/;
	pathArr.forEach((pathItem)=>{
		glob.sync(pathItem).forEach((entry)=>{
			if(entry.match(pathReg)){
				console.log(entry);
				var titleReg=/\d{2}-\d{2}(?=\/index\.html)/;
				var titlename=entry.match(titleReg)[0];
				result.push(new htmlwebpackplugin({
					template:entry,
					filename:'index.html',
					title:titlename
				}));
			}
		});
	});
	return result;
})();
console.log('yes');
let entrys=(()=>{
	let result={};
	let pathArr=['./01/**/*.js'];
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
		]
	},
	plugins:[
		...htmlOutputs,
		new cleanwebpackplugin(['dist'])
	],
}
