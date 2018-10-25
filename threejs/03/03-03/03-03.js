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
	renderer.shadowMapType=THREE.PCFShadowMap;
	var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    var planeGeometry=new THREE.PlaneGeometry(60,20,500,500);//50,50分别是长，宽上的分隔
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

	var target=new THREE.Object3D();
	target.position=new THREE.Vector3(3,5,0);
	var pointColor='#ffffff';
	var spotLight=new THREE.SpotLight(pointColor);
	spotLight.position.set(-40,60,-10);
	spotLight.castShadow=true;
	spotLight.shadowCameraNear=2;
	spotLight.shadowCameraFar=200;
	spotLight.shadowCameraFov=30;
	spotLight.target=plane;
	spotLight.distance=0;
	spotLight.angle=0.4;
	scene.add(spotLight);

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
		this.intensity=1;
		this.distance=0;
		this.exponent=30;
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
		spotLight.color=new THREE.Color(e);
	});
	gui.add(controls,'angle',0,Math.PI*2).onChange(function(e){
		spotLight.angle=e;
	});
	gui.add(controls,'intensity',0,5).onChange(function(e){
		spotLight.intensity=e;
	});
	gui.add(controls,'distance',1,200).onChange(function(e){
		spotLight.distance=e;
	});
	gui.add(controls,'exponent',0,100).onChange(function(e){
		spotLight.exponent=e;
	});
	gui.add(controls,'debug').onChange(function(e){
		spotLight.shadowCameraVisible=e;
	});
	gui.add(controls,'castShadow').onChange(function(e){
		spotLight.castShadow=e;
	});
	gui.add(controls,'onlyShadow').onChange(function(e){
		spotLight.onlyShadow=e;
	});
	gui.add(controls,'target',['Plane','Sphere','Cube']).onChange(function(e){
		switch(e){
			case 'Plane':
				spotLight.target=plane;
				break;
			case 'Sphere':
				spotLight.target=sphere;
				break;
			case 'Cube':
				spotLight.target=cube;
				break;
		}
	});
	gui.add(controls,'stopMovingLight').onChange(function(e){
		stopMovingLight=e;
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
		if(!stopMovingLight){
			if(phase>2*Math.PI){
				invert=invert*-1;
				phase-=2*Math.PI;
			}else{
				phase+=controls.rotationSpeed;
			}
			sphereLightMesh.position.z=+(7*(Math.sin(phase)));
			sphereLightMesh.position.x=+(14*(Math.cos(phase)));
			sphereLightMesh.position.y=10;
			if(invert<0){
				var pivot=14;
				sphereLightMesh.position.x=(invert*(sphereLightMesh.position.x-pivot))+pivot;
			}
			spotLight.position.copy(sphereLightMesh.position);
		}
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