
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

	threeCore.camera.position.copy( params.thirdPersCameraTarget );

	threeCore.camera.lookAt( target.position );

	loopCallback = () => {

		/* position behind the player */

		target.getWorldDirection( _vec2 )

		_vec1.copy( threeCore.camera.position );
		_vec1.sub( target.position );
		_vec1.y = 0;

		// get signed angle
		let angle = _vec1.angleTo( _vec2 );
		_vec3.crossVectors( _vec1, _vec2 );
		if ( _vec3.dot( target.up ) < 0 ) {
			angle = -angle;
		}

		// the more the camera is far from the target angle, so less fast it turns
		let additionalEasing = ( Math.PI - Math.abs( angle ) ) / Math.PI;
		additionalEasing = Math.pow( additionalEasing, 3 );

		threeCore.camera.position.applyAxisAngle( target.up, angle * CAMERA_EASING * additionalEasing );

		/* look at the player */

		threeCore.camera.lookAt( target.position );

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
