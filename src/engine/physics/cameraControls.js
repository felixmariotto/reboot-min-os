
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import core from '../core/core.js';
import params from '../params.js';

//

core.callInLoop( loop );

let loopCallback;

const _vec = new THREE.Vector3();

//

function orbitDynamicObj( target ) {

	if ( !target.isBody ) {
		console.warn('characterControl.controlVelocity : target is not a body');
	}

	const CAMERA_ROTATION_EASING = 0.1;

	let movementX = 0;
	let movementY = 0;

	// y rot
	let targetRot = 0;
	let lastRot = 0;

	// slent
	let targetSlent = 1;
	let lastSlent = 1;

	// camera position
	const lastPosition = new THREE.Vector3();
	const targetPosition = new THREE.Vector3();

	//

	core.renderer.domElement.requestPointerLock();

	core.renderer.domElement.addEventListener( 'mousemove', (event) => {

		movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		targetRot += ( movementX * 0.003 );
		targetSlent += ( movementY * 0.003 );

		targetSlent = Math.min( 1, Math.max( 0, targetSlent ) );

	});

	//

	loopCallback = () => {

		lastRot += ( targetRot - lastRot ) * CAMERA_ROTATION_EASING;
		lastSlent += ( targetSlent - lastSlent ) * CAMERA_ROTATION_EASING;

		_vec.copy( target.position );

		//

		targetPosition.set(
			0,
			params.thirdPersCameraTarget.y,
			params.thirdPersCameraTarget.z * ( lastSlent * 0.5 + 0.5 )
		);

		targetPosition.applyAxisAngle( target.up, lastRot );

		targetPosition.add( _vec );

		lastPosition.set(
			targetPosition.x,
			THREE.MathUtils.lerp( lastPosition.y, targetPosition.y, 0.02 ),
			targetPosition.z
		);

		//

		core.camera.position.copy( lastPosition );

		core.camera.lookAt( _vec );

	}

}

//

function orbitObj( target ) {

	const controls = new OrbitControls(
		core.camera,
		core.renderer.domElement
	);

	core.camera.position.copy( target.position );

	core.camera.position.set( 10, 17, 15 );

	core.camera.lookAt( target.position );

	controls.target.copy( target.position );

	return controls

}

//

function loop() {

	if ( loopCallback ) loopCallback();

}

//

export default {
	orbitObj,
	orbitDynamicObj
}
