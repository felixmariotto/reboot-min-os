
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import core from '../core/core.js';
import params from '../params.js';

//

core.callInLoop( loop );

let loopCallback;

//

const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const _vec3 = new THREE.Vector3();

//

function followObj( target ) {

	const CAMERA_TARGETING_EASING = 0.001;
	const CAMERA_ROTATION_EASING = 0.03;
	const CAM_TARGET_DISTANCE = 2.5;

	let lastCamPos = new THREE.Vector3().copy( params.thirdPersCameraTarget );

	core.camera.position.copy( lastCamPos );
	core.camera.position.add( target.position );
	core.camera.lookAt( target.position );

	function getCameraTargetAngle() {

		target.getWorldDirection( _vec2 );

		// current direction of camera behind the player
		_vec1.copy( core.camera.position );
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

		core.camera.position.copy( lastCamPos );
		core.camera.position.add( target.position );

		//

		const angle = getCameraTargetAngle();

		// the more the camera is far from the target angle, so less fast it turns
		let additionalEasing = ( Math.PI - Math.abs( angle ) ) / Math.PI;
		additionalEasing = Math.pow( additionalEasing, 3 );

		core.camera.position.sub( target.position );
		core.camera.position.applyAxisAngle( target.up, angle * CAMERA_ROTATION_EASING * additionalEasing );
		core.camera.position.add( target.position );

		lastCamPos.copy( core.camera.position );
		lastCamPos.sub( target.position );

		/* look in front of the player */

		// target
		_vec1.copy( target.position );
		target.getWorldDirection( _vec2 );
		_vec2.negate();
		_vec2.multiplyScalar( CAM_TARGET_DISTANCE );
		_vec1.add( _vec2 );

		core.camera.getWorldDirection( _vec2 );
		_vec2.add( core.camera.position );

		_vec3.lerpVectors( _vec1, _vec2, 1 - CAMERA_TARGETING_EASING );

		core.camera.lookAt( _vec3 );

	}

}

//

function orbitDynamicObj( target ) {

	const CAM_TARGET_DISTANCE = 2.5;
	const CAMERA_ROTATION_EASING = 0.1;
	const CAMERA_TARGETING_EASING = 0.014;

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

	// camera position
	let lastPosition = new THREE.Vector3();
	let targetPosition = new THREE.Vector3();

	//

	core.renderer.domElement.requestPointerLock();

	core.renderer.domElement.addEventListener( 'mousemove', (event) => {

		movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		targetRot += ( movementX * 0.003 );
		targetSlent += ( movementY * 0.003 );

		targetSlent = Math.min( 1, Math.max( 0, targetSlent ) );

	});

	loopCallback = () => {

		lastRot += ( targetRot - lastRot ) * CAMERA_ROTATION_EASING;
		lastSlent += ( targetSlent - lastSlent ) * CAMERA_ROTATION_EASING;

		//

		targetTarget
		.copy( target.velocity )
		.normalize()
		.multiplyScalar( -CAM_TARGET_DISTANCE );

		lastTarget.lerpVectors( lastTarget, targetTarget, CAMERA_TARGETING_EASING );

		_vec1
		.copy( lastTarget )
		.add( target.position );

		//

		targetPosition.set(
			0,
			params.thirdPersCameraTarget.y,
			params.thirdPersCameraTarget.z * ( lastSlent * 0.5 + 0.5 )
		);

		targetPosition.applyAxisAngle( target.up, lastRot );

		targetPosition.add( _vec1 );

		lastPosition.set(
			targetPosition.x,
			THREE.MathUtils.lerp( lastPosition.y, targetPosition.y, 0.02 ),
			targetPosition.z
		);

		//

		core.camera.position.copy( lastPosition );

		core.camera.lookAt( _vec1 );

	}

}

//

function orbitObj( target ) {

	const controls = new OrbitControls(
		core.camera,
		core.renderer.domElement
	);

	core.camera.position.copy( target.position );
	core.camera.position.z += 5;

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
