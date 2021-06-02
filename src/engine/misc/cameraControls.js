
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import core from '../core/core.js';
import params from '../params.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();
const previousTargetPos = new THREE.Vector3();

//

core.callInLoop( loop );

let loopCallback;

function loop() {

	if ( loopCallback ) loopCallback();

}

//

function orbitWorldPlayer( world ) {

	const target = world.player;

	let movement = new THREE.Vector2();
	let targetMovement = new THREE.Vector2();

	const targetTarget = new THREE.Vector3().copy( target.position );

	//

	loopCallback = () => {

		targetTarget.lerp( target.position, params.cameraEasing );

		// tween the camera towards the target position

		core.camera.position.lerp( world.state.cameraTargetPos, params.cameraEasing );

		core.camera.lookAt( targetTarget );

		// update the vector shared with the worker so the worker can
		// apply collision and update it.

		targetMovement.clampLength( 0, 1 );

		_vec.copy( world.state.cameraTargetPos );

		_vec.sub( targetTarget );
		_vec.applyAxisAngle( target.up, targetMovement.x * 0.2 );
		_vec.add( targetTarget );

		_vec0.copy( target.position ).sub( previousTargetPos );

		_vec.add( _vec0 );

		//

		world.state.cameraTargetPos.x = _vec.x;
		world.state.cameraTargetPos.y = _vec.y;
		world.state.cameraTargetPos.z = _vec.z;

		targetMovement.setScalar( 0 );

		//

		previousTargetPos.copy( target.position );

	}

	//

	core.renderer.domElement.requestPointerLock();

	core.renderer.domElement.addEventListener( 'mousemove', (event) => {

		movement.x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		movement.y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		targetMovement.addScaledVector( movement, 0.003 );

	});

	/*

	//

	let movementX = 0;
	let movementY = 0;

	let targetRot = 0;
	let targetSlent = 1;

	//

	const targetPosition = new THREE.Vector3();
	const targetTarget = new THREE.Vector3().copy( target.position );

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

		// get camera position wanted by the user input

		targetPosition.set(
			0,
			params.thirdPersCameraTarget.y,
			params.thirdPersCameraTarget.z * ( targetSlent * 0.5 + 0.5 )
		);

		targetPosition.applyAxisAngle( target.up, targetRot );

		targetTarget.lerp( target.position, params.cameraEasing );

		targetPosition.add( targetTarget );

		// lerp camera position with target position corrected by worker.
		// the camera was collided against the world to avoid traversing walls etc..

		core.camera.position.lerp( world.state.cameraTargetPos, params.cameraEasing );

		core.camera.lookAt( targetTarget );

		// give the worker the target position to collide against the world

		world.state.cameraTargetPos.x = targetPosition.x;
		world.state.cameraTargetPos.y = targetPosition.y;
		world.state.cameraTargetPos.z = targetPosition.z;

	}

	*/

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

export default {
	orbitObj,
	orbitWorldPlayer
}
