
import * as THREE from 'three';

import threeCore from '../core/threeCore.js';
import params from '../params.js';

//

threeCore.callInLoop( loop );

let loopCallback;

//

const CAMERA_EASING = 0.06;

const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const _vec3 = new THREE.Vector3();

//

function followObj( target ) {

	let lastCamPos = new THREE.Vector3().copy( params.thirdPersCameraTarget );

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

		/* position the camera behind the player */

		threeCore.camera.position.copy( lastCamPos );
		threeCore.camera.position.add( target.position );

		//

		const angle = getCameraTargetAngle();

		// the more the camera is far from the target angle, so less fast it turns
		let additionalEasing = ( Math.PI - Math.abs( angle ) ) / Math.PI;
		additionalEasing = Math.pow( additionalEasing, 3 );

		threeCore.camera.position.sub( target.position );
		threeCore.camera.position.applyAxisAngle( target.up, angle * CAMERA_EASING * additionalEasing );
		threeCore.camera.position.add( target.position );

		lastCamPos.copy( threeCore.camera.position );
		lastCamPos.sub( target.position );

		/* look in front of the player */

		// target
		_vec1.copy( target.position );
		target.getWorldDirection( _vec2 );
		_vec2.negate();
		_vec2.multiplyScalar( 3 );
		_vec1.add( _vec2 );

		threeCore.camera.getWorldDirection( _vec2 );
		_vec2.add( threeCore.camera.position );

		_vec3.lerpVectors( _vec1, _vec2, 0.996 );

		threeCore.camera.lookAt( _vec3 );

	}

}

//

function loop() {

	if ( loopCallback ) loopCallback();

}

//

export default {
	followObj
}
