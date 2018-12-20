import './webgl-utils.js';
import initShaders from './initShaders.js';
var gl,program,first=true,index=0;
function init(){
	var canvas=document.getElementById('gl');
	gl=WebGLUtils.setupWebGL(canvas);
	if(!gl){
		console.log('something error');
	}
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);
	program=initShaders(gl,'vertex-shader','fragment-shader');
	gl.useProgram(program);
	var buffer=gl.createBuffer();
	var a_Position=gl.getAttribLocation(program,'a_Position');
	var t1,t2,t3,t4;
	canvas.addEventListener('mousedown',function(event){
		console.log(first);
		gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
		if(first){
			first=false;
			t1=vec2(-1+2*event.clientX/canvas.width,-1+2*(canvas.height-event.clientY)/canvas.height);
			console.log(t1);
		}else{
			first=true;
			t2=vec2(-1+2*event.clientX/canvas.width-1,-1+2*(canvas.height-event.clientY)/canvas.height);
			console.log(t1);
			t3=vec2(t1[0],t2[1]);
			t4=vec2(t2[0],t1[1]);
			gl.bufferSubData(gl.ARRAY_BUFFER,sizeof['vec2']*(index+0),flatten(t1));
			gl.bufferSubData(gl.ARRAY_BUFFER,sizeof['vec2']*(index+1),flatten(t3));
			gl.bufferSubData(gl.ARRAY_BUFFER,sizeof['vec2']*(index+2),flatten(t2));
			gl.bufferSubData(gl.ARRAY_BUFFER,sizeof['vec2']*(index+3),flatten(t4));
			gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
			gl.enableVertexAttribArray(a_Position);
			render();
			index+=4;
		}
	});
}
function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	for(var i=0;i<index;i+=4){
		gl.drawArrays(gl.TRIANGLES_FAN,i,4);
	}
	requestAnimationFrame(render);
}
window.onload=init();