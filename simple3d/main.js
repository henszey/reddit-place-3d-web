
import * as THREE from './build/three.module.js';

import Stats from './jsm/libs/stats.module.js';
import { GUI } from './jsm/libs/dat.gui.module.js';
import { OrbitControls } from "./jsm/controls/OrbitControls.js";
import { FlyControls } from './jsm/controls/FlyControls.js';
import { FirstPersonControls } from './jsm/controls/FirstPersonControls.js';
import { PointerLockControls } from './jsm/controls/PointerLockControls.js';



var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

let camera, scene, renderer, stats, controls, clock;

let mesh;
const amount = parseInt( window.location.search.substr( 1 ) ) || 10;
const count = 1000000;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2( 1, 1 );
const color = new THREE.Color();

			let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;
			let moveUp = false;
			let moveDown = false;
			let canJump = false;
			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			
init();
animate();

var lookX = 0;
var lookY = 0;



function init() {
	
	clock = new THREE.Clock();

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 4000 );
  var dist = 200;
	camera.position.set( dist, dist, dist);
	camera.lookAt( 0, 0, 0 );

	scene = new THREE.Scene();

	const light1 = new THREE.HemisphereLight( 0xffffff, 0x000000 );
	light1.position.set( - 1, 1.5, 1 );
	scene.add( light1 );

	const light2 = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.5 );
	light2.position.set( - 1, - 1.5, - 1 );
	scene.add( light2 );

	const geometry = new THREE.BoxBufferGeometry( 1, 10, 1 );
	let material = new THREE.MeshPhongMaterial();
	
	    material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: new THREE.TextureLoader().load('texture.jpg'),
        //opacity: 0.8,
        //transparent: true,
        side: THREE.DoubleSide,
    });

	mesh = new THREE.InstancedMesh( geometry, material, count );

	const offset = 0;

	const matrix = new THREE.Matrix4();

	let i = 0;
	
	
			for ( let x = 0; x < 1000; x ++ ) {
				for ( let y = 0; y < 1000; y ++ ) {

						matrix.setPosition(x*1-500, 0, y*1-500);
						mesh.setMatrixAt( i, matrix );
						//mesh.setColorAt( i, color.set('rgb('+(190+getRandomInt(-5,5)) +', '+(161+getRandomInt(-5,5))+', '+(124+getRandomInt(-5,5))+')') );
						mesh.setColorAt( i, color.set('rgb(255,255,255)') );
						//mesh.setColorAt( i, color.setHex( Math.random() * 0xffffff ) );
				i++;
				}
			}
	
	
	scene.add(mesh);


/*
				const gridHelper = new THREE.GridHelper( 400, 40, 0x0000ff, 0x808080 );
				gridHelper.position.y = 1;
				gridHelper.position.x = 0;
				scene.add( gridHelper );


				const plane = new THREE.Mesh(
					new THREE.PlaneGeometry( 10000, 10000 ),
					new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 1, transparent: true } )
				);
				plane.position.y = 0;
				plane.rotation.x = - Math.PI / 2;
				scene.add( plane );
*/




	//

	const gui = new GUI();
	gui.add( mesh, 'count', 0, count );
	//gui.add( mesh, 'heat', true, count );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//new OrbitControls( camera, renderer.domElement );
	/*
				controls = new FlyControls( camera, renderer.domElement );
				controls.movementSpeed = 50;
				controls.domElement = renderer.domElement;
				controls.rollSpeed = Math.PI / 12;
				controls.autoForward = false;
				controls.dragToLook = true;
*/
/*
	controls = new FirstPersonControls( camera, renderer.domElement );
	controls.movementSpeed = 150;
	controls.lookSpeed = 0.1;
*/

controls = new PointerLockControls( camera, document.body );
window.addEventListener( 'click', function () {
					controls.lock();
				} );

				const onKeyDown = function ( event ) {
					switch ( event.code ) {
						case 'ArrowUp':
						case 'KeyW':
							moveForward = true;
							break;
						case 'ArrowLeft':
						case 'KeyA':
							moveLeft = true;
							break;
						case 'ArrowDown':
						case 'KeyS':
							moveBackward = true;
							break;
						case 'ArrowRight':
						case 'KeyD':
							moveRight = true;
							break;
						case 'KeyQ':
							moveDown = true;
							break;
						case 'KeyE':
							moveUp = true;
							break;
						case 'Space':
							if ( canJump === true ) velocity.y += 350;
							canJump = false;
							break;
					}
				};
				const onKeyUp = function ( event ) {
					switch ( event.code ) {
						case 'ArrowUp':
						case 'KeyW':
							moveForward = false;
							break;
						case 'ArrowLeft':
						case 'KeyA':
							moveLeft = false;
							break;
						case 'ArrowDown':
						case 'KeyS':
							moveBackward = false;
							break;
						case 'ArrowRight':
						case 'KeyD':
							moveRight = false;
							break;
						case 'KeyQ':
							moveDown = false;
							break;
						case 'KeyE':
							moveUp = false;
							break;
					}

				};
				document.addEventListener( 'keydown', onKeyDown );
				document.addEventListener( 'keyup', onKeyUp );


	stats = new Stats();
	document.body.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize );
	document.addEventListener( 'mousemove', onMouseMove );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

				controls.handleResize();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


var pos = 0;
var arr = null;

var heatValue = new Uint8Array(1000000);
var heat = new Set();


function animate() {
	requestAnimationFrame( animate );
	render();
}

let currentY = 0;

function render() {
	const time = performance.now();
	//const delta = clock.getDelta();
	
	//raycaster.setFromCamera( mouse, camera );
	/*
	if(pressedKeys["87"]){
		lookY += 1 ;
	}
	camera.lookAt( 0, 0, lookY );
*/
  if(arr != null) {
	  const matrix = new THREE.Matrix4();
		var lastY = 0;
	  while(++pos + 1 < arr.length) {
		
		if(arr[pos] & 0x400){
			currentY = arr[pos] ^ 0x400;
			continue;
		}
		
	
		
		  //const x = arr[pos] & 0x7FF;
		  //const y = arr[pos] >> 11 & 0x7FF;
		  //const c = arr[pos] >> 22 & 0xF;
		  
  		  const x = arr[pos] & 0x7FF;
		  const c = arr[pos] >> 11 & 0xF;
		  const y = currentY;
		  
		  
	
			const i = x*1000 + y;

			heat.add(i);
			if(heatValue[i] < 200) heatValue[i]+=4;
	


			mesh.setColorAt( x*1000 + y, color.setHex( colors[c] ) );
			mesh.instanceColor.needsUpdate = true;
	
	    if(lastY > y) break;
	    lastY = y;
		}
		
		for(const i of heat){
			
			
			
			matrix.setPosition(Math.floor(i/1000)*1-500, heatValue[i]/10.0, (i%1000)*1-500);
			mesh.setMatrixAt( i, matrix );
			mesh.instanceMatrix.needsUpdate = true;
			if(heatValue[i] > 100){
				heatValue[i]-=2;
			} else {
				heatValue[i]--;
			}
			if(heatValue[i] == 0){
				heat.delete(i);
			}
		}
		
		
		if(!(++pos + 1 < arr.length)){
			pos = 0;
			for(let i = 0; i < 1000000; i++){
				mesh.setColorAt(i, color.setHex( 0xFFFFFF ) );
				mesh.instanceColor.needsUpdate = true;
			}
		}
		
	}


/*
	const intersection = raycaster.intersectObject( mesh );
	if ( intersection.length > 0 ) {
		const instanceId = intersection[ 0 ].instanceId;
		mesh.setColorAt( instanceId, color.setHex( Math.random() * 0xffffff ) );
		mesh.instanceColor.needsUpdate = true;
	}
*/
	//controls.movementSpeed = 0.33;// * d;
	//controls.update( delta );
	
	
	
					const delta = ( time - prevTime ) / 1000;

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveRight ) - Number( moveLeft );
					direction.normalize(); // this ensures consistent movements in all directions

					if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
					if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
					controls.moveRight( - velocity.x * delta );
					controls.moveForward( - velocity.z * delta );
					
					if(moveUp) controls.getObject().position.y += 100 * delta;
					if(moveDown) controls.getObject().position.y -= 100 * delta;
					
					
					
	prevTime = time;
	
	
	renderer.render( scene, camera );
	stats.update();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const colors = [
	0x000000,
	0xffffff,
	0x51e9f4,
	0xb44ac0,
	0x00a368,
	0x3690ea,
	0x2450a4,
	0xffd635,
	0x9c6926,
	0xff99aa,
	0x7eed56,
	0xffa800,
	0xd4d7d9,
	0x811e9f,
	0x898d90,
	0xff4500];
/*
let test = fetch('diff.dat')
  .then(function(response) {
    return response.arrayBuffer();
  })
  .then(function(data) {
	  arr = new Int32Array(data);
  });
  
console.log(test);
 */

{
	let response = await fetch('../diffv2.dat');

	const reader = response.body.getReader();
	
	// Step 2: get total length
	const contentLength = +response.headers.get('Content-Length');
	
	// Step 3: read the data
	let receivedLength = 0; // received that many bytes at the moment
	let chunks = []; // array of received binary chunks (comprises the body)
	while(true) {
	  const {done, value} = await reader.read();
	
	  if (done) {
	    break;
	  }
	
	  chunks.push(value);
	  receivedLength += value.length;
	
	  document.getElementById("loadingtext").innerHTML = `Received ${Math.round(receivedLength/100000)/10}mb of ${Math.round(contentLength/100000)/10}mb`;
	  console.log(`Received ${Math.round(receivedLength/100000)/10}mb of ${Math.round(contentLength/100000)/10}mb`)
	}
	
	let blob = new Blob(chunks);
	new Response(blob).arrayBuffer()
.then(function(data) {
	  document.getElementById("loadingtext").innerHTML = "Loaded!"
	  arr = new Uint16Array(data);
  });


}



