require('../../css/common.css');
const $=require('jquery');
const THREE=require('../../js/three.js');
const Stats=require('../../js/stats.js').default;
const dat=require('../../js/dat.gui.js').default;
$(function(){
	var scene=new THREE.Scene();
	var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
	var renderer=new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0));
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.shadowMapEnabled=true;
	var axes = new THREE.AxisHelper(20);
    scene.add(axes);
	function initStats(){
		var stats=new Stats();
		stats.setMode(0);
		stats.domElement.style.position='absolute';
		stats.domElement.style.left='0px';
		stats.domElement.style.top='0px';
		$('#Stats-output').append(stats.domElement);
		return stats;
	}
	var stats=initStats();
	var cubeGeometry=new THREE.BoxGeometry(4,4,4);
	var cubeMaterial=new THREE.MeshLambertMaterial({color:0xff7777});
	var cube=new THREE.Mesh(cubeGeometry,cubeMaterial);
	cube.castShadow=true;//使产生投影
	cube.position.x=-4;
	cube.position.y=3;
	cube.position.z=0;
	scene.add(cube);
	var sphereGeometry=new THREE.SphereGeometry(4,20,20);
	var sphereMeterial=new THREE.MeshLambertMaterial({color:0x7777ff});
	var sphere=new THREE.Mesh(sphereGeometry,sphereMeterial);
	sphere.position.x=20;
	sphere.position.y=0;
	sphere.position.z=2;
	sphere.castShadow=true;
 	scene.add(sphere);
 	var sphereLight=new THREE.SphereGeometry(0.2);
 	var sphereLightMaterial=new THREE.MeshBasicMaterial({color:0xac6c25});//注意这里是BasicMaterial
 	var sphereLightMesh=new THREE.Mesh(sphereLight,sphereLightMaterial);
 	sphereLightMesh.position=new THREE.Vector3(3,0,3);
 	sphereLightMesh.castShadow=true;
 	scene.add(sphereLightMesh);

	var ambiColor='#0c0c0c';
	var ambientLight=new THREE.AmbientLight(ambiColor);
	scene.add(ambientLight);
	var pointColor='#ccffcc';
	var controls=new function(){
		this.rotationSpeed=0.03;
		this.boundingSpeed=0.03;
		this.ambientColor=ambiColor;
		this.pointColor=pointColor;
		this.intensity=1;
		this.distance=100;
	}
	var gui=new dat.GUI();
	gui.addColor(controls,'ambientColor').onChange(function(e){
		ambientLight.color=new THREE.Color(e);
	});
	gui.addColor(controls,'pointColor').onChange(function(e){
		pointLight.color=new THREE.Color(e);
	});
	gui.add(controls,'intensity',0,3);
	gui.add(controls,'distance',1,100);
	var step=0;
	var invert=1;
	var phase=0;

	function render(){
		stats.update();
		cube.rotation.x+=controls.rotationSpeed;
		cube.rotation.y+=controls.rotationSpeed;
		cube.rotation.y+=controls.rotationSpeed;
		step+=controls.boundingSpeed;
		sphere.position.x=20+(10*Math.cos(step));
		sphere.position.y=2+(10*Math.abs(Math.sin(step)));
		pointLight.intensity=controls.intensity;
		pointLight.distance=controls.distance;
		if(phase>2*Math.PI){
			invert=invert*-1;
			phase-=2*Math.PI;
		}else{
			phase+=controls.rotationSpeed;
		}
		sphereLightMesh.position.z=+(7*(Math.sin(phase)));
		sphereLightMesh.position.x=+(14*(Math.cos(phase)));
		sphereLightMesh.position.y=5;
		if(invert<0){
			var pivot=14;
			sphereLightMesh.position.x=(invert*(sphereLightMesh.position.x-pivot))+pivot;
		}
		pointLight.position.copy(sphereLightMesh.position);
		requestAnimationFrame(render);
		renderer.render(scene,camera);
	}
	var planeGeometry=new THREE.PlaneGeometry(60,20,50,50);//50,50分别是长，宽上的分隔
	var planeMaterial=new THREE.MeshLambertMaterial({
		color:0xffffff
	});
	var plane=new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x=-0.5*Math.PI;
	plane.position.x=15;
	plane.position.y=0;
	plane.position.z=0;
	plane.receiveShadow=true;
	scene.add(plane);
	var pointLight=new THREE.PointLight(pointColor);
	pointLight.distance=100;
	scene.add(pointLight);
	camera.position.x=-25;
	camera.position.y=30;
	camera.position.z=25;
	camera.lookAt(new THREE.Vector3(10,0,0));
	scene.add(camera);
	$('#WebGL-output').append(renderer.domElement);
	render();
});