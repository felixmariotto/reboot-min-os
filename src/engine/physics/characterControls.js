
import * as THREE from 'three';
import core from '../core/core.js';
import input from '../misc/input.js';
import params from '../params.js';

//

core.callInLoop( loop );

let loopCallback;

function loop() {

	if ( loopCallback ) loopCallback();

}

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

			_vec1
			.copy( core.camera.position )
			.sub( target.position )
			.setY( 0 );
			
			// get signed angle

			let angle = _vec1.angleTo( FORWARD );

			_vec3.crossVectors( _vec1, FORWARD );

			if ( _vec3.dot( target.up ) < 0 ) {
				angle = -angle;
			}

			// get world direction

			targetDirection
			.set( -input.targetDirection.x, 0, -input.targetDirection.y )
			.applyAxisAngle( target.up, -angle );

			// move forward

			target.position.addScaledVector( targetDirection, -1 * MOVE_SPEED );

		}

		// smooth turn toward target direction

		// current dir
		target.getWorldDirection( _vec2 );
		_vec2.add( target.position );

		// target dir
		_vec1
		.copy( targetDirection )
		.add( target.position );

		_vec3.lerpVectors( _vec1, _vec2, TURN_SPEED );

		// boost u-turns speed
		if ( _vec3.distanceTo( target.position ) < U_TURN_THRESHOLD ) {
			
			// new base dir at cross position
			target.getWorldDirection( _vec2 );
			
			_vec2
			.crossVectors( _vec2, target.up )
			.add( target.position );

			_vec3.lerpVectors( _vec1, _vec2, 0.97 );

		}

		target.lookAt( _vec3 );

	}

}

//

function controlVelocity( target ) {

	if ( !target.isBody ) {
		console.warn('characterControl.controlVelocity : target is not a body');
	}

	loopCallback = () => {

		// move the player in X Z direction

		if ( target.isColliding && input.targetDirection.length() > 0 ) {

			_vec1
			.copy( core.camera.position )
			.sub( target.position )
			.setY( 0 );
			
			// get signed angle

			let angle = _vec1.angleTo( FORWARD );

			_vec3.crossVectors( _vec1, FORWARD );

			if ( _vec3.dot( target.up ) < 0 ) {
				angle = -angle;
			}

			// get world direction

			targetDirection
			.set( -input.targetDirection.x, 0, -input.targetDirection.y )
			.applyAxisAngle( target.up, -angle );

			// move forward

			const factor = -1 * params.playerSpeed * ( target.isOnGround ? 1 : params.notOnGroundHandicap );

			target.velocity.addScaledVector( targetDirection, factor );

		}

	}

}

//

export default {
	control,
	controlVelocity
}
