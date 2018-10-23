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
	
	// var vertices=[
	// 	new THREE.Vector3(1,3,1),
	// 	new THREE.Vector3(1,3,-1),
	// 	new THREE.Vector3(1,-1,1),
	// 	new THREE.Vector3(1,-1,-1),
	// 	new THREE.Vector3(-1,3,-1),
	// 	new THREE.Vector3(-1,3,1),
	// 	new THREE.Vector3(-1,-1,-1),
	// 	new THREE.Vector3(-1,-1,1)
	// ];
	// var faces=[
	// 	new THREE.Face3(0,2,1),
	// 	new THREE.Face3(2,3,1),
	// 	new THREE.Face3(4,6,5),
	// 	new THREE.Face3(6,7,5),
	// 	new THREE.Face3(4,5,1),
	// 	new THREE.Face3(5,0,1),
	// 	new THREE.Face3(7,6,2),
	// 	new THREE.Face3(6,3,2),
	// 	new THREE.Face3(5,7,0),
	// 	new THREE.Face3(7,2,0),
	// 	new THREE.Face3(1,3,4),
	// 	new THREE.Face3(3,6,4)
	// ];
	
	
	var controls=new function(){
		this.scaleX=1;
		this.scaleY=1;
		this.scaleZ=1;

		this.positionX=0;
		this.positionY=4;
		this.positionZ=0;

		this.rotationX=0;
		this.rotationY=0;
		this.rotationZ=0;
		this.scale=1;

		this.translateX=0;
		this.translateY=0;
		this.translateZ=0;

		this.visible=true;

		this.translate=function(){
			cube.translateX(controls.translateX);
			cube.translateY(controls.translateY);
			cube.translateZ(controls.translateZ);

			controls.positionX=cube.position.x;
			controls.positionY=cube.position.y;
			controls.positionZ=cube.position.z;
		}
		this.switch=function(){
			if(camera instanceof THREE.PerspectiveCamera){
				camera=new THREE.OrthographicCamera(window.innerWidth/-16,window.innerWidth/16,window.innerHeight/16,window.innerHeight/-16,-200,500);
				camera.position.x=2;
				camera.position.y=1;
				camera.position.z=3;
				camera.lookAt(scene.position);
			}else{
				camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,100);
				camera.position.x=-30;
				camera.position.y=40;
				camera.position.z=30;
				camera.lookAt(new THREE.Vector3(-5,10,15));
			}
		}
	}
	var material=new THREE.MeshLambertMaterial({
		color:0x44ff44
	});
	var geom=new THREE.BoxGeometry(5,8,3);
	var cube=new THREE.Mesh(geom,material);
	cube.position.x=0;
	cube.position.y=4;
	cube.position.z=0;
	cube.castShadow=true;
	scene.add(cube);

	var gui=new dat.GUI();
	var guiScale=gui.addFolder('scale');
	guiScale.add(controls,'scaleX',0,5);
	guiScale.add(controls,'scaleY',0,5);
	guiScale.add(controls,'scaleY',0,5);
	gui.add(controls,'switch');
	var guiPosition=gui.addFolder('position');
	var contx=guiPosition.add(controls,'positionX',-10,10);
	var contY=guiPosition.add(controls,'positionY',-4,20);
	var contZ=guiPosition.add(controls,'positionZ',-10,10);
	contx.listen();
	contx.onChange(function(value){
		cube.position.x=controls.positionX;
	});
	contY.listen();
	contY.onChange(function(value){
		cube.position.y=controls.positionY;
	});
	contZ.listen();
	contZ.onChange(function(){
		cube.position.z=controls.positionZ;
	});
	var translate=gui.addFolder('translate');
	translate.add(controls,'translateX',-2,2);
	var guiRotation=gui.addFolder('rotation');
	guiRotation.add(controls,'rotationX',-4,4);

	function render(){
		stats.update();
		cube.position.y=controls.positionY;
		requestAnimationFrame(render);
		renderer.render(scene,camera);
	}
	
	var planeGeometry=new THREE.PlaneGeometry(60,40,1,1);
	var planeMaterial=new THREE.MeshLambertMaterial({
		color:0xffffff
	});
	var plane=new THREE.Mesh(planeGeometry,planeMaterial);
	plane.rotation.x=-0.5*Math.PI;
	plane.position.x=0;
	plane.position.y=0;
	plane.position.z=0;
	plane.receiveShadow=true;
	scene.add(plane);
	var spotLight=new THREE.SpotLight(0xffffff);
	spotLight.position.set(-40,60,-10);
	spotLight.castShadow=true;
	scene.add(spotLight);
	var ambientLight=new THREE.AmbientLight(0x0c0c0c);
	scene.add(ambientLight);
	camera.position.x=-30;
	camera.position.y=40;
	camera.position.z=30;
	camera.lookAt(scene.position);
	scene.add(camera);
	$('#WebGL-output').append(renderer.domElement);
	render();
});