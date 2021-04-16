
import * as THREE from 'three';
import params from '../params.js';

// THREE.js

let delta;
let container;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.style.height = '100vh';
renderer.domElement.style.width = '100vw';

const camera = new THREE.PerspectiveCamera(
	params.cameraFOV,
	1,
	params.cameraNear,
	params.cameraFar
);

const clock = new THREE.Clock();
const deltaClock = new THREE.Clock();

const loopCallbacks = [];

//

window.addEventListener( 'resize', resize );

//

function init( domElement ) {

	container = domElement;

	container.append( renderer.domElement );

	resize();

	clock.start();

	loop();

}

//

function resize() {

	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( container.offsetWidth, container.offsetHeight );

}

//

function loop() {

	delta = deltaClock.getDelta();

	requestAnimationFrame( loop );

	loopCallbacks.forEach( callback => callback( delta ) );

	renderer.render( scene, camera );

}

//

function callInLoop( fn ) {

	loopCallbacks.push( fn );

}

//

export default {
	init,
	scene,
	camera,
	renderer,
	clock,
	callInLoop
}
