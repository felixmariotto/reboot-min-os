
import * as THREE from 'three';

import core from '../core/core.js';
import input from '../misc/input.js';
import events from '../misc/events.js';
import easing from '../misc/easing.js';
import files from '../files/files.js';

//

const FORWARD = new THREE.Vector3( 0, 0, -1 );

const _v0 = new THREE.Vector3();
const _v1 = new THREE.Vector3();
const targetDirection = new THREE.Vector3();

let lastJumpTime = 0;
const PLAYER_JUMP_DURATION = 300; // in MS

const animationManager = {
	animateLevel,
	animate
};

core.callInLoop( ( delta ) => animationManager.animate( delta ) );

files.models.player.then( playerModel => {
	
	animationManager.playerModel = playerModel;

	playerModel.traverse( child => {

		if ( child.name === "wheels" ) animationManager.playerWheels = child;

	} );

} );

export default animationManager

// events listeners

events.on( 'player-jumped', () => {

	lastJumpTime = Date.now();

	// console.log('ok')

} );

// methods

function animateLevel( level ) {

	this.level = level;
	this.player = level.world.player;

}

//

function animate( delta ) {

	if ( this.level ) {

		const inputMovLen = input.targetDirection.length();

		// if the player input movement, we compute the target player mesh rotation.

		if ( inputMovLen > 0 ) {

			_v0
			.copy( core.camera.position )
			.sub( this.player.position )
			.setY( 0 );

			let angle = _v0.angleTo( FORWARD );

			_v1.crossVectors( _v0, FORWARD );

			if ( _v1.dot( this.player.up ) < 0 ) angle = -angle;

			// get world direction

			targetDirection
			.set( -input.targetDirection.x, 0, -input.targetDirection.y )
			.applyAxisAngle( this.player.up, -angle );

		}

		// tweening of the player mesh towards the target rotation

		_v0
		.copy( targetDirection )
		.lerp( this.player.getWorldDirection( _v1 ), 0.7 )
		.add( this.player.position );

		this.player.lookAt( _v0 );

		// player wheels animation

		if ( inputMovLen ) this.playerWheels.rotation.x -= 0.3; // * inputMovLen;

		// player jump animation

		let t = ( Date.now() - lastJumpTime ) / PLAYER_JUMP_DURATION;

		if ( t < 1 ) {

			t = easing.easeOutQuad( t );

			this.playerWheels.position.y = - 0.7 * Math.sin( t * Math.PI );

		}

	}

}