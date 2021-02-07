
import * as THREE from 'three';
import threeCore from '../core/threeCore.js';
import input from '../misc/input.js';

//

threeCore.callInLoop( loop );

let loopCallback;

//

const MOVE_SPEED = 0.11;
const TURN_SPEED = 0.76;
const U_TURN_THRESHOLD = 0.65;

const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const _vec3 = new THREE.Vector3();

const targetDirection = new THREE.Vector3();

const FORWARD = new THREE.Vector3( 0, 0, -1 );

//

function control( target ) {

	loopCallback = () => {

		if ( input.targetDirection.length() > 0 ) {

			_vec1.copy( threeCore.camera.position );
			_vec1.sub( target.position );
			_vec1.y = 0;
			
			// get signed angle
			let angle = _vec1.angleTo( FORWARD );
			_vec3.crossVectors( _vec1, FORWARD );
			if ( _vec3.dot( target.up ) < 0 ) {
				angle = -angle;
			}

			targetDirection.set( -input.targetDirection.x, 0, -input.targetDirection.y );

			targetDirection.applyAxisAngle( target.up, -angle );

			// move forward

			target.position.addScaledVector( targetDirection, -1 * MOVE_SPEED );

		}

		// smooth turn toward target direction

		// current dir
		target.getWorldDirection( _vec2 );
		_vec2.add( target.position );

		// target dir
		_vec1.copy( targetDirection );
		_vec1.add( target.position );

		_vec3.lerpVectors( _vec1, _vec2, TURN_SPEED );

		// boost u-turns speed
		if ( _vec3.distanceTo( target.position ) < U_TURN_THRESHOLD ) {
			
			// new base dir at cross position
			target.getWorldDirection( _vec2 );
			_vec2.crossVectors( _vec2, target.up );
			_vec2.add( target.position );

			_vec3.lerpVectors( _vec1, _vec2, 0.97 );

		}

		target.lookAt( _vec3 );

	}

}

//

function loop() {

	if ( loopCallback ) loopCallback();

}

//

export default {
	control
}
