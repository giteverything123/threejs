require('../../css/common.css');
const $=require('jquery');
const THREE=require('../../js/three.js');
const Stats=require('../../js/stats.js').default;
const dat=require('../../js/dat.gui.js').default;
$(function(){
	
	var stats=initStats();
	var scene=new THREE.Scene();
	scene.fog=new THREE.Fog(0xaaaaaa,0.01,200);
	var camera=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
	var renderer=new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0xaaaaff,1.0));
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.shadowMapEnabled=true;
	var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    $('#img').attr('src','../../img/grasslight-big.jpg');
    var textureGrass=THREE.ImageUtils.loadTexture('../../img/grasslight-big.jpg');
    textureGrass.wrapS=THREE.RepeatWrapping;
    textureGrass.wrapT=THREE.RepeatWrapping;
    textureGrass.repeat.set(4,4);

    var planeGeometry=new THREE.PlaneGeometry(1000,200,20,20);
	var planeMaterial=new THREE.MeshLambertMaterial({
		map:textureGrass
	});
    var plane=new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x=-0.5*Math.PI;
	plane.position.x=15;
	plane.position.y=0;
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

	var sphereGeometry=new THREE.SphereGeometry(4,25,25);
	var sphereMeterial=new THREE.MeshLambertMaterial({color:0x7777ff});
	var sphere=new THREE.Mesh(sphereGeometry,sphereMeterial);
	sphere.position.x=10;
	sphere.position.y=5;
	sphere.position.z=10;
	sphere.castShadow=true;
 	scene.add(sphere);

 	camera.position.x=-20;
	camera.position.y=15;
	camera.position.z=45;
	camera.lookAt(new THREE.Vector3(10,0,0));

	var spotLight0=new THREE.SpotLight(0xcccccc);
	spotLight0.position.set(-40,60,-10);
	spotLight0.lookAt(plane);
	scene.add(spotLight0);

	var hemiLight=new THREE.HemisphereLight(0x0000ff,0x00ff00,0.6);
	hemiLight.position.set(0,500,0);
	scene.add(hemiLight);

	var pointColor='#ffffff';
	var dirLight=new THREE.DirectionalLight(pointColor);
	dirLight.position.set(30,10,50);
	dirLight.castShadow=true;
	dirLight.target=plane;
	dirLight.shadowCameraNear=0.1;
	dirLight.shadowCameraFar=200;
	dirLight.shadowCameraLeft=-50;
	dirLight.shadowCameraRight=50;
	dirLight.shadowCameraTop=50;
	dirLight.shadowCameraBottom=-50;
	dirLight.shadowMapHeight=2048;
	dirLight.shadowMapWidth=2048;
	scene.add(dirLight);



 	$('#WebGL-output').append(renderer.domElement);

 	var step=0;
	var invert=1;
	var phase=0;

	var controls=new function(){
		this.rotationSpeed=0.03;
		this.boundingSpeed=0.03;
		this.hemisphere=true;
		this.color=0x00ff00;
		this.skyColor=0x0000ff;
		this.intensity=0.6;
	}
	var gui=new dat.GUI();
	gui.add(controls,'hemisphere').onChange(function(e){
		if(!e){
			hemiLight.intensity=0;
		}else{
			hemiLight.intensity=controls.intensity;
		}
	});

	gui.addColor(controls,'color').onChange(function(e){
		hemiLight.groundColor=new THREE.Color(e);
	});
	gui.addColor(controls,'skyColor').onChange(function(e){
		hemiLight.color=new THREE.Color(e);
	});
	gui.add(controls,'intensity',0,5).onChange(function(e){
		hemiLight.intensity=e;
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