
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import threeCore from '../core/threeCore.js';
import params from '../params.js';

//

threeCore.callInLoop( loop );

let loopCallback;

//

const CAMERA_ROTATION_EASING = 0.03;
const CAMERA_TARGETING_EASING = 0.001;
const CAM_TARGET_DISTANCE = 2.5;

const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const _vec3 = new THREE.Vector3();

//

function followObj( target ) {

	let lastCamPos = new THREE.Vector3().copy( params.thirdPersCameraTarget );

	threeCore.camera.position.copy( lastCamPos );
	threeCore.camera.position.add( target.position );
	threeCore.camera.lookAt( target.position );

	function getCameraTargetAngle() {

		target.getWorldDirection( _vec2 );

		// current direction of camera behind the player
		_vec1.copy( threeCore.camera.position );
		_vec1.sub( target.position );
		_vec1.y = 0;

		// get signed angle between forward-player and camera
		let angle = _vec1.angleTo( _vec2 );
		_vec3.crossVectors( _vec1, _vec2 );
		if ( _vec3.dot( target.up ) < 0 ) {
			angle = -angle;
		}

		return angle

	}

	loopCallback = () => {

		/* position the camera behind the player with tweening */

		threeCore.camera.position.copy( lastCamPos );
		threeCore.camera.position.add( target.position );

		//

		const angle = getCameraTargetAngle();

		// the more the camera is far from the target angle, so less fast it turns
		let additionalEasing = ( Math.PI - Math.abs( angle ) ) / Math.PI;
		additionalEasing = Math.pow( additionalEasing, 3 );

		threeCore.camera.position.sub( target.position );
		threeCore.camera.position.applyAxisAngle( target.up, angle * CAMERA_ROTATION_EASING * additionalEasing );
		threeCore.camera.position.add( target.position );

		lastCamPos.copy( threeCore.camera.position );
		lastCamPos.sub( target.position );

		/* look in front of the player */

		// target
		_vec1.copy( target.position );
		target.getWorldDirection( _vec2 );
		_vec2.negate();
		_vec2.multiplyScalar( CAM_TARGET_DISTANCE );
		_vec1.add( _vec2 );

		threeCore.camera.getWorldDirection( _vec2 );
		_vec2.add( threeCore.camera.position );

		_vec3.lerpVectors( _vec1, _vec2, 1 - CAMERA_TARGETING_EASING );

		threeCore.camera.lookAt( _vec3 );

	}

}

//

function orbitDynamicObj( target ) {

	const rotEasing = 0.1;

	let movementX = 0;
	let movementY = 0;

	// y rot
	let targetRot = 0;
	let lastRot = 0;

	// slent
	let targetSlent = 1;
	let lastSlent = 1;

	// camera target
	let lastTarget = new THREE.Vector3();
	let targetTarget = new THREE.Vector3();

	//

	threeCore.renderer.domElement.requestPointerLock();

	threeCore.renderer.domElement.addEventListener( 'mousemove', (event) => {

		movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		targetRot += ( movementX * 0.003 );
		targetSlent += ( movementY * 0.003 );

		targetSlent = Math.min( 1, Math.max( 0, targetSlent ) );

	});

	loopCallback = () => {

		lastRot += ( targetRot - lastRot ) * rotEasing;
		lastSlent += ( targetSlent - lastSlent ) * rotEasing;

		//

		target.getWorldDirection( targetTarget );
		targetTarget.multiplyScalar( -CAM_TARGET_DISTANCE );
		targetTarget.add( target.position );

		lastTarget.lerpVectors( lastTarget, targetTarget, 0.01 );

		// console.log( lastTarget );

		//

		threeCore.camera.position.set(
			0,
			params.thirdPersCameraTarget.y,
			params.thirdPersCameraTarget.z * ( lastSlent * 0.6 + 0.4 )
		);

		threeCore.camera.position.applyAxisAngle( target.up, lastRot );

		threeCore.camera.position.add( lastTarget );

		threeCore.camera.lookAt( lastTarget );

	}

}

//

function orbitObj( target ) {

	const controls = new OrbitControls(
		threeCore.camera,
		threeCore.renderer.domElement
	);

	threeCore.camera.position.copy( target.position );
	threeCore.camera.position.z += 5;

}

//

function loop() {

	if ( loopCallback ) loopCallback();

}

//

export default {
	followObj,
	orbitObj,
	orbitDynamicObj
}
