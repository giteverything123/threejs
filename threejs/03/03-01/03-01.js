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
	var cubeMaterial=new THREE.MeshLambertMaterial({color:0xff0000});
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
	var ambiColor='#0c0c0c';
	var ambientLight=new THREE.AmbientLight(ambiColor);
	scene.add(ambientLight);
	var controls=new function(){
		this.rotationSpeed=0.02;
		this.boundingSpeed=0.03;
		this.ambientColor=ambiColor;
		this.disableSpotlight=false;
	}
	var gui=new dat.GUI();
	gui.addColor(controls,'ambientColor').onChange(function(e){
		ambientLight.color=new THREE.Color(e);
	});
	gui.add(controls,'disableSpotlight').onChange(function(e){
		spotLight.visible=!e;
	});
	var step=0;
	function render(){
		stats.update();
		cube.rotation.x+=controls.rotationSpeed;
		cube.rotation.y+=controls.rotationSpeed;
		cube.rotation.y+=controls.rotationSpeed;
		step+=controls.boundingSpeed;
		sphere.position.x=20+(10*Math.cos(step));
		sphere.position.y=2+(10*Math.abs(Math.sin(step)));
		requestAnimationFrame(render);
		renderer.render(scene,camera);
	}
	var planeGeometry=new THREE.PlaneGeometry(60,20,1,1);
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
	var spotLight=new THREE.SpotLight(0xffffff);
	spotLight.position.set(-40,60,-10);
	spotLight.castShadow=true;//使该光源产生阴影
	scene.add(spotLight);
	camera.position.x=-25;
	camera.position.y=30;
	camera.position.z=25;
	camera.lookAt(new THREE.Vector3(10,0,0));
	scene.add(camera);
	$('#WebGL-output').append(renderer.domElement);
	render();
});