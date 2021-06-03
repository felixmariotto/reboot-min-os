
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import params from '../params.js';
import events from '../misc/events.js';

// THREE.js

const USE_STATS = true;

let delta;
let container;

const stats = new Stats();
if ( USE_STATS ) document.body.appendChild( stats.dom );

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true ;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaFactor = 2.2;
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

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

//

window.addEventListener( 'resize', resize );

//

function init( domElement ) {

	container = domElement;

	container.append( renderer.domElement );

	resize();

	clock.start();

	setupPointerLock();

}

//

function resize() {

	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( container.offsetWidth, container.offsetHeight );

}

//

function setupPointerLock() {

	renderer.domElement.requestPointerLock();

	renderer.domElement.addEventListener( 'click', () => {

		renderer.domElement.requestPointerLock();

	} );

	document.addEventListener( 'pointerlockchange', () => {

		if ( !document.pointerLockElement ) events.emit( 'pause' )

	}, false);

}

//

const moveCallbacks = [];
const clickCallbacks = [];

function onMouseMove( event ) {

	// compute mouse position in normalized device coordinates
	// (-1 to +1) for both mouse components

	if ( moveCallbacks.length || clickCallbacks.length ) {

		mouse.set(
			Math.min( event.clientX, container.offsetWidth ),
			Math.max( 0, event.clientY - ( window.innerHeight - container.offsetHeight ) )
		);

		mouse.x /= container.offsetWidth;
		mouse.y /= container.offsetHeight;

		mouse.multiplyScalar( 2 );

		mouse.x -= 1;
		mouse.y -= 1;
		mouse.y *= -1;

		// look for intersection in the scene

		if ( moveCallbacks.length ) {

			// update the picking ray with the camera and mouse position
			raycaster.setFromCamera( mouse, camera );

			// calculate objects intersecting the picking ray
			const intersects = raycaster.intersectObjects( scene.children );

			if ( intersects.length ) {

				moveCallbacks.forEach( callback => callback( intersects ) );

			}

		}

	}

}

function onClick() {

	if ( clickCallbacks.length ) {

		// update the picking ray with the camera and mouse position
		raycaster.setFromCamera( mouse, camera );

		// calculate objects intersecting the picking ray
		const intersects = raycaster.intersectObjects( scene.children, true );

		if ( intersects.length ) {

			clickCallbacks.forEach( callback => callback( intersects ) );

		}

	}

}

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'click', onClick, false );

function listenClick( callback ) {

	clickCallbacks.push( callback );

}

function listenMove( callback ) {

	moveCallbacks.push( callback );

}

//

function render() {

	delta = deltaClock.getDelta();

	loopCallbacks.forEach( callback => callback( delta ) );

	renderer.render( scene, camera );

	if ( USE_STATS ) stats.update();

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
	callInLoop,
	listenClick,
	listenMove,
	render
}
