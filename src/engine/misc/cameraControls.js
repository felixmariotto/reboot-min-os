
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import core from '../core/core.js';
import params from '../params.js';

//

core.callInLoop( loop );

let loopCallback;

function loop() {

	if ( loopCallback ) loopCallback();

}

//

function orbitWorldPlayer( world ) {

	const target = world.player;

	//

	let movementX = 0;
	let movementY = 0;

	let targetRot = 0;
	let targetSlent = 1;

	//

	const targetPosition = new THREE.Vector3();
	const targetTarget = new THREE.Vector3().copy( target.position );

	//

	setInterval( () => {

		console.log( world.state.cameraTargetPos )

	}, 1000 );

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

		targetPosition.set(
			0,
			params.thirdPersCameraTarget.y,
			params.thirdPersCameraTarget.z * ( targetSlent * 0.5 + 0.5 )
		);

		targetPosition.applyAxisAngle( target.up, targetRot );

		targetTarget.lerp( target.position, params.cameraEasing );

		targetPosition.add( targetTarget );

		core.camera.position.lerp( targetPosition, params.cameraEasing );

		core.camera.lookAt( targetTarget );

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

export default {
	orbitObj,
	orbitWorldPlayer
}
