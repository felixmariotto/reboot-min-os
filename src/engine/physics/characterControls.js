
import * as THREE from 'three';
import threeCore from '../core/threeCore.js';
import input from '../misc/input.js';

//

threeCore.callInLoop( loop );

let loopCallback;

//

const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const _vec3 = new THREE.Vector3();

const targetDirection = new THREE.Vector3();

//

function control( target ) {

	loopCallback = () => {

		if ( input.targetDirection.length() > 0 ) {

			targetDirection.set( input.targetDirection.x, 0, input.targetDirection.y );

		}

		// smooth turn toward target direction

		target.getWorldDirection( _vec2 );
		_vec2.add( target.position );

		_vec1.copy( targetDirection );
		_vec1.add( target.position );

		_vec3.lerpVectors( _vec1, _vec2, 0.65 );

		// boost u-turns speed
		if ( _vec3.distanceTo( target.position ) < 0.5 ) {
			
			_vec3.lerpVectors( _vec1, _vec2, 0.6 );

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
