
import core from '../../core/core.js';
import params from '../../params.js';
import easing from '../../misc/easing.js';

//

export default function World() {

	const world = {
		playing: false,
		bodies: [],
		addBody,
		updatePhysics,
		play,
		pause
	};

	//

	function addBody() {

		this.bodies.push( ...arguments );

	}

	function play() { this.playing = true; }

	function pause() { this.playing = false }

	//

	function updatePhysics( delta ) {

		// frame gravity, dependant on frame rate
		const gravity = params.gravity * delta;

		this.bodies.forEach( (body) => {

			if ( body.mass === null ) {

				// fixed object

			} else {

				const maxSpeed = ( params.maxBodySpeed * body.mass ) * delta;

				// add gravity
				body.velocity.y -= gravity;

				// collide with all other bodies in the world pool
				this.bodies.forEach( (bodyToCollide) => {

					if ( bodyToCollide === body ) return
					else body.collideWith( bodyToCollide );

				} );

				// pull according to maximum speed
				const velSpeed = body.velocity.length();
				const velFactor = velSpeed / maxSpeed;
				body.velocity.multiplyScalar( 1 - Math.min( 0.5, ( 0.1 * velFactor ) ) );

				body.position.add( body.velocity );

			}

			if ( body.helper ) body.helper.position.copy( body.position );

		} );

	}

	core.callInLoop( ( delta ) => {

		if ( world.playing ) {

			for ( let i=0 ; i<params.physicsSimTicks ; i++ ) {

				world.updatePhysics( delta / params.physicsSimTicks );

			}

		}

	} );

	//

	return world

}