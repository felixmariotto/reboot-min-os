
import * as THREE from 'three';
import params from '../params.js';

//

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

const loopCallbacks = [];

//

window.addEventListener( 'resize', resize );

//

function init() {

	document.body.innerHTML = '';

	document.body.append( renderer.domElement );

	resize();

	clock.start();

	loop();

}

//

function resize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function loop() {

	requestAnimationFrame( loop );

	loopCallbacks.forEach( callback => callback() );

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
