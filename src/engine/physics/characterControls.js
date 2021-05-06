
import * as THREE from 'three';
import core from '../core/core.js';
import input from '../misc/input.js';
import params from '../params.js';

//

core.callInLoop( loop );

let loopCallback;

function loop( delta ) {

	if ( loopCallback ) loopCallback( delta );

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

	loopCallback = ( delta ) => {

		// move the player in X Z direction

		if ( input.targetDirection.length() > 0 ) {

			_vec1
			.copy( core.camera.position )
			.sub( target.position )
			.setY( 0 );
			
			// get signed angle

			let angle = _vec1.angleTo( FORWARD );

			_vec3.crossVectors( _vec1, FORWARD );

			if ( _vec3.dot( target.up ) < 0 ) angle = -angle;

			// get world direction

			targetDirection
			.set( -input.targetDirection.x, 0, -input.targetDirection.y )
			.applyAxisAngle( target.up, -angle );

			// compute acceleration vector length

			const speedRatio = delta / ( 1 /  60 );

			const factor = getSpeedFactor( target );

			targetDirection.multiplyScalar( factor * speedRatio * -1 * params.playerAcceleration );

			// apply acceleration with a threshold ( if player moves fast, then can't get faster )

			const beforeSpeed = target.velocity.length();

			target.velocity.add( targetDirection );

			const afterSpeed = target.velocity.length();

			// acceleration reducer if the resulting speed is beyond threshold
			if (
				afterSpeed > params.playerMaxAcceleration &&
				afterSpeed > beforeSpeed
			) {

				const addedSpeed = targetDirection.length()

				const subRatio = ( afterSpeed - beforeSpeed ) / addedSpeed

				targetDirection.multiplyScalar( subRatio );

				target.velocity.sub( targetDirection );

			}

		}

	}

}

function getSpeedFactor( player ) {

	if ( player.isOnGround ) return 1
	else if ( player.isColliding ) return params.notOnGroundHandicap
	else return params.notCollidingHandicap

}

//

export default {
	control,
	controlVelocity
}
