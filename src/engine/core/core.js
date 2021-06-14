
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import params from '../params.js';
import events from '../misc/events.js';
import input from '../misc/input.js';

//

const api = {
	scene: new THREE.Scene(),
	camera: new THREE.PerspectiveCamera(
		params.cameraFOV,
		1,
		params.cameraNear,
		params.cameraFar
	),
	renderer: new THREE.WebGLRenderer({ antialias: true }),
	clock: new THREE.Clock(),
	init,
	callInLoop,
	removeFromLoop,
	listenClick,
	listenMove,
	render,
	resize,
	makeSurePointerLock,
	setupPointerLock,
	onClick,
	onMouseMove
}

//

const USE_STATS = true;

let delta;
let container;

const stats = new Stats();
if ( USE_STATS ) document.body.appendChild( stats.dom );

api.renderer.shadowMap.enabled = true ;
api.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
api.renderer.outputEncoding = THREE.sRGBEncoding;
api.renderer.gammaFactor = 2.2;
api.renderer.domElement.style.height = '100vh';
api.renderer.domElement.style.width = '100vw';

const deltaClock = new THREE.Clock();

const loopCallbacks = [];

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener( 'resize', () => {
	api.resize();
} );

// events emitted by the options menu, to update the camera
// and sounds parameters.

events.on( 'update-params', (e) => {

	// update camera fov

	const oldCamera = api.camera;

	api.camera = new THREE.PerspectiveCamera(
		e.detail.fov,
		1,
		params.cameraNear,
		params.cameraFar
	);

	api.camera.position.copy( oldCamera.position );
	api.camera.rotation.copy( oldCamera.rotation );

	api.resize();

	// update camera controls

	params.invertCamX = e.detail.invertCamX;
	params.invertCamY = e.detail.invertCamY;

} );

// this is started before any world is set up, because we want to control
// the user interface with the gamepad.
inputLoop();

function inputLoop() {
	input.updateGamepadState();
	requestAnimationFrame( inputLoop );
}

//

function init( domElement, skipPointerLock ) {

	container = domElement;

	container.append( this.renderer.domElement );

	this.resize();

	this.clock.start();

	if ( !skipPointerLock ) this.setupPointerLock();

}

//

function resize() {

	if ( !container ) return

	this.camera.aspect = container.offsetWidth / container.offsetHeight;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize( container.offsetWidth, container.offsetHeight );

	this.renderer.render( this.scene, this.camera );

}

//

function setupPointerLock() {

	this.renderer.domElement.requestPointerLock();

	this.renderer.domElement.addEventListener( 'click', () => {

		this.renderer.domElement.requestPointerLock();

	} );

	document.addEventListener( 'pointerlockchange', () => {

		if ( !document.pointerLockElement ) {

			events.emit( 'pointerlock-disabled' );

		} else {

			events.emit( 'pointerlock-enabled' );

		}

	}, false );

	// Failure to enable pointerlock happen very easily in Chrome.
	// See: https://bugs.chromium.org/p/chromium/issues/detail?id=1127223
	document.addEventListener( 'pointerlockerror', () => {

		events.emit( 'pointerlock-failed' );

	} );

}

// manually exit pointerlock when the user press the gamepad pause button.

events.on( 'pressed-pause-btn', () => {

	document.exitPointerLock();

} );

// this function exists because Google Chrome will not allow requesting
// pointerlock too often, so it will fail very often. If it fails,
// we want the user to click again. ( thank you, Google Chrome )

function makeSurePointerLock() {

	return new Promise( (resolve, reject) => {

		const handleChange = () => {

			if ( document.pointerLockElement ) {

				resolve( 'success' );

			} else {

				resolve( 'failure' );

			}

			document.removeEventListener( 'pointerlockchange', handleChange );
			document.removeEventListener( 'pointerlockerror', handleFailure );

		}

		const handleFailure = () => {

			resolve( 'failure' );

			document.removeEventListener( 'pointerlockchange', handleChange );
			document.removeEventListener( 'pointerlockerror', handleFailure );

		}

		document.addEventListener( 'pointerlockchange', handleChange );
		document.addEventListener( 'pointerlockerror', handleFailure );

		this.renderer.domElement.requestPointerLock();

	} );

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
			raycaster.setFromCamera( mouse, this.camera );

			// calculate objects intersecting the picking ray
			const intersects = raycaster.intersectObjects( this.scene.children );

			if ( intersects.length ) {

				moveCallbacks.forEach( callback => callback( intersects ) );

			}

		}

	}

}

function onClick() {

	if ( clickCallbacks.length ) {

		// update the picking ray with the camera and mouse position
		raycaster.setFromCamera( mouse, this.camera );

		// calculate objects intersecting the picking ray
		const intersects = raycaster.intersectObjects( this.scene.children, true );

		if ( intersects.length ) {

			clickCallbacks.forEach( callback => callback( intersects ) );

		}

	}

}

window.addEventListener( 'mousemove', (e) => api.onMouseMove(e), false );
window.addEventListener( 'click', (e) => api.onClick(e), false );

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

	this.renderer.render( this.scene, this.camera );

	if ( USE_STATS ) stats.update();

}

//

function callInLoop( fn ) {

	loopCallbacks.push( fn );

}

//

function removeFromLoop( fn ) {

	const idx = loopCallbacks.indexOf( fn );

	if ( idx > -1 ) loopCallbacks.splice( idx, 1 );

}

//

export default api
