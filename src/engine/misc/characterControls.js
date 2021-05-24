
import * as THREE from 'three';
import core from '../core/core.js';
import input from '../misc/input.js';
import events from '../misc/events.js';
import params from '../params.js';

//

core.callInLoop( loop );

let loopCallback;

function loop( delta ) {

	if ( loopCallback ) loopCallback( delta );

}

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

const targetDirection = new THREE.Vector3();

const FORWARD = new THREE.Vector3( 0, 0, -1 );

/*

controls the passed world's player velocity with information
from the input module.

*/

function controlVelocity( world ) {

	events.on( 'jump-key-down', () => {

		world.emitEvent( 'jump' );

	} );

	events.on( 'pull-key-down', () => {

		world.emitEvent( 'pull' );

	} );

	events.on( 'release-key-down', () => {

		world.emitEvent( 'release' );

	} );

	//

	world.controller = function () {

		if ( !this.player ) {
			console.warn('characterControl.controlVelocity : no player object to control');
		} else if ( !this.player.isEntity ) {
			console.warn('characterControl.controlVelocity : world.player is not an entity');
		}

		// move the player in X Z direction

		if ( input.targetDirection.length() > 0 ) {

			_vec
			.copy( core.camera.position )
			.sub( this.player.position )
			.setY( 0 );
			
			// get signed angle

			let angle = _vec.angleTo( FORWARD );

			_vec0.crossVectors( _vec, FORWARD );

			if ( _vec0.dot( this.player.up ) < 0 ) angle = -angle;

			// get world direction

			targetDirection
			.set( -input.targetDirection.x, 0, -input.targetDirection.y )
			.applyAxisAngle( this.player.up, -angle );

			// compute acceleration vector length

			const factor = getSpeedFactor( this.player );

			targetDirection.multiplyScalar( factor * -1 * params.playerAcceleration );

			// apply acceleration with a threshold ( if player moves fast, then can't get faster )

			const beforeSpeed = this.player.velocity.length();

			this.player.velocity.add( targetDirection );

			const afterSpeed = this.player.velocity.length();

			// acceleration reducer if the resulting speed is beyond threshold
			if (
				afterSpeed > params.playerMaxAcceleration &&
				afterSpeed > beforeSpeed
			) {

				const addedSpeed = targetDirection.length();

				const subRatio = ( afterSpeed - beforeSpeed ) / addedSpeed;

				targetDirection.multiplyScalar( subRatio );

				this.player.velocity.sub( targetDirection );

			}

			// update transferable array so the web worker
			// knows the change to the player velovity

			this.player.updateVelocities( this.velocities );

		}

	}

}

function getSpeedFactor( player ) {

	if ( player.isOnGround ) return 1
	else if ( player.isColliding ) return params.notOnGroundHandicap
	return params.notCollidingHandicap

}

//

export default {
	controlVelocity
}
