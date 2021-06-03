
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import core from '../core/core.js';
import input from '../misc/input.js';
import params from '../params.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();
const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const previousTargetPos = new THREE.Vector3();

const NOMINAL_PLAYER_CAM_DIST = params.thirdPersCameraInit.length();

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

		// if the player has a gamepad,
		// they can move the camera with the right joystick

		targetMovement.addScaledVector( input.targetCamDirection, 0.5 );

		// tween the focus point of the camera

		targetTarget.lerp( target.position, params.cameraEasing );

		// tween the camera towards the target position

		core.camera.position.lerp( world.state.cameraTargetPos, params.cameraEasing );

		core.camera.lookAt( targetTarget );

		// update the vector shared with the worker so the worker can
		// apply collision and update it.

		targetMovement.clampLength( 0, 1 );

		_vec.copy( world.state.cameraTargetPos );

		// follow the player

		_vec0.copy( target.position ).sub( previousTargetPos );
		_vec.add( _vec0 );

		// turn around the player according to x mousemove
		
		_vec.sub( targetTarget );
		_vec.applyAxisAngle( target.up, targetMovement.x * params.cameraHorizontalSpeed );
		_vec.add( targetTarget );

		// slent around the player according to y mousemove

		_vec.y -= targetMovement.y * params.cameraVerticalSpeed;

		// clamp slent

		_vec.y = THREE.MathUtils.clamp(
			_vec.y,
			targetTarget.y + params.camMinMaxHeight[0],
			targetTarget.y + params.camMinMaxHeight[1]
		);

		// move the camera to place it at its nominal distance from the player

		const playerToCamera = _vec0.copy( _vec ).sub( targetTarget );

		const resolutionVector = _vec1
		.copy( playerToCamera )
		.setLength( NOMINAL_PLAYER_CAM_DIST )
		.sub( playerToCamera );

		_vec.add( resolutionVector )

		//

		world.state.cameraTargetPos.x = _vec.x;
		world.state.cameraTargetPos.y = _vec.y;
		world.state.cameraTargetPos.z = _vec.z;

		//

		targetMovement.setScalar( 0 );

		previousTargetPos.copy( target.position );

	}

	//

	core.renderer.domElement.addEventListener( 'mousemove', (event) => {

		movement.x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		movement.y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		targetMovement.addScaledVector( movement, 0.003 );

	});

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
