require('../../css/common.css');
const $=require('jquery');
const THREE=require('../../js/three.js');
const Stats=require('../../js/stats.js').default;
const dat=require('../../js/dat.gui.js').default;
$(function(){
	var stopMovingLight=false;
	var stats=initStats();
	var scene=new THREE.Scene();
	var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
	var renderer=new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0xEEEEEE,1.0));
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.shadowMapEnabled=true;
	var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    var planeGeometry=new THREE.PlaneGeometry(60,20,500,500);//50,50分别是长，宽上的分隔
	var planeMaterial=new THREE.MeshLambertMaterial({
		color:0xffffff
	});
    var plane=new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x=-0.5*Math.PI;
	plane.position.x=15;
	plane.position.y=-5;
	plane.position.z=0;
	plane.receiveShadow=true;
	scene.add(plane);

	var cubeGeometry=new THREE.BoxGeometry(4,4,4);
	var cubeMaterial=new THREE.MeshLambertMaterial({color:0xff3333});
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

 	camera.position.x=-25;
	camera.position.y=30;
	camera.position.z=25;
	camera.lookAt(new THREE.Vector3(10,0,0));

	var ambiColor='#1c1c1c';
	var ambientLight=new THREE.AmbientLight(ambiColor);
	scene.add(ambientLight);

	var spotLight0=new THREE.SpotLight(0xcccccc);
	spotLight0.position.set(-40,30,-10);
	spotLight0.lookAt(plane);
	scene.add(spotLight0);

	// var target=new THREE.Object3D();
	// target.position=new THREE.Vector3(3,5,0);
	var pointColor='#ff5808';
	var directionalLight=new THREE.DirectionalLight(pointColor);
	directionalLight.position.set(-40,60,-10);
	directionalLight.castShadow=true;
	directionalLight.shadowCameraNear=2;
	directionalLight.shadowCameraFar=200;
	directionalLight.shadowCameraLeft=-50;
	directionalLight.shadowCameraRight=50;
	directionalLight.shadowCameraTop=50;
	directionalLight.shadowCameraBottom=-50;
	directionalLight.distance=0;
	directionalLight.intensity=0.5;
	directionalLight.shadowMapHeight=2048;
	directionalLight.shadowMapWidth=2048;
	scene.add(directionalLight);

	var sphereLight=new THREE.SphereGeometry(0.2);
 	var sphereLightMaterial=new THREE.MeshBasicMaterial({color:0xac6c25});//注意这里是BasicMaterial
 	var sphereLightMesh=new THREE.Mesh(sphereLight,sphereLightMaterial);
 	sphereLightMesh.position=new THREE.Vector3(3,0,3);
 	sphereLightMesh.castShadow=true;
 	scene.add(sphereLightMesh);

 	$('#WebGL-output').append(renderer.domElement);

 	var step=0;
	var invert=1;
	var phase=0;

	var controls=new function(){
		this.rotationSpeed=0.03;
		this.boundingSpeed=0.03;
		this.ambientColor=ambiColor;
		this.pointColor=pointColor;
		this.intensity=0.5;
		this.distance=0;
		this.angle=0.1;
		this.debug=false;
		this.castShadow=true;
		this.onlyShadow=false;
		this.target='Plane';
		this.stopMovingLight=false;
	}
	var gui=new dat.GUI();
	gui.addColor(controls,'ambientColor').onChange(function(e){
		ambientLight.color=new THREE.Color(e);
	});
	gui.addColor(controls,'pointColor').onChange(function(e){
		directionalLight.color=new THREE.Color(e);
	});
	gui.add(controls,'intensity',0,5).onChange(function(e){
		directionalLight.intensity=e;
	});
	gui.add(controls,'distance',0,200).onChange(function(e){
		directionalLight.distance=e;
	});
	gui.add(controls,'debug').onChange(function(e){
		directionalLight.shadowCameraVisible=e;
	});
	gui.add(controls,'castShadow').onChange(function(e){
		directionalLight.castShadow=e;
	});
	gui.add(controls,'onlyShadow').onChange(function(e){
		directionalLight.onlyShadow=e;
	});
	gui.add(controls,'target',['Plane','Sphere','Cube']).onChange(function(e){
		switch(e){
			case 'Plane':
				directionalLight.target=plane;
				break;
			case 'Sphere':
				directionalLight.target=sphere;
				break;
			case 'Cube':
				directionalLight.target=cube;
				break;
		}
	});
	render();
	function render(){
		stats.update();
		cube.rotation.x+=controls.rotationSpeed;
		cube.rotation.y+=controls.rotationSpeed;
		cube.rotation.y+=controls.rotationSpeed;
		step+=controls.boundingSpeed;
		sphere.position.x=20+(10*Math.cos(step));
		sphere.position.y=2+(10*Math.abs(Math.sin(step)));
		
		sphereLightMesh.position.z=-8;
		sphereLightMesh.position.x=+(27*(Math.sin(step/3)));
		sphereLightMesh.position.y=10+(26*(Math.cos(step/3)));
		directionalLight.position.copy(sphereLightMesh.position);
		requestAnimationFrame(render);
		renderer.render(scene,camera);
	}
	function initStats(){
		var stats=new Stats();
		stats.setMode(0);
		stats.domElement.style.position='absolute';
		stats.domElement.style.left='0px';
		stats.domElement.style.top='0px';
		$('#Stats-output').append(stats.domElement);
		return stats;
	}
});