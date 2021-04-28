
import * as THREE from 'three';
import core from '../../core/core.js';
import params from '../../params.js';
import constants from '../../misc/constants.js';

//

const MAX_DELTA = 1 / 30;
const NOMINAL_TICK_TIME = ( 1 / 60 ) / params.physicsSimTicks;

//

export default function World() {

	const world = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isWorld: true,
			enabled: true,
			chains: []
		}
	);

	//

	core.callInLoop( ( delta ) => {

		update.call( world, delta );

	} );

	function update( delta ) {

		if ( this.enabled ) {

			for ( let i=0 ; i<params.physicsSimTicks ; i++ ) {

				updatePhysics.call( world, Math.min( delta, MAX_DELTA ) / params.physicsSimTicks );

			}

		}

	}

	function updatePhysics( delta ) {

		// call every kinematic body transformation callback

		const time = Date.now();

		this.children.forEach( (body) => {

			if (
				body.bodyType === constants.KINEMATIC_BODY &&
				body.updateTransform
			) {

				body.updateTransform( time );

				body.lastTransformTime = time;

				body.updateMatrixWorld();

			} else {

				body.updateMatrixWorld();

			}

		} );

		//

		this.children.forEach( body => body.updateMatrixWorld() );

		//

		this.children.forEach( (body) => {

			if ( !body.isBody ) console.warn( 'an object that is not a body was added to the world' )

			if ( body.bodyType === constants.DYNAMIC_BODY ) {

				// reset these values, which will be set to true again if still on ground/colliding.
				// Used by characterControl.

				body.isOnGround = false;
				body.isColliding = false;

				// add gravity to velocity

				body.velocity.addScaledVector( params.gravity, ( 1 / params.physicsSimTicks ) * ( delta / NOMINAL_TICK_TIME ) * body.mass );

				// update position according to velocity

				body.position.addScaledVector( body.velocity, ( delta / NOMINAL_TICK_TIME ) / params.physicsSimTicks );

				body.updateMatrixWorld();

				// collide with non-dynamic bodies

				this.children.forEach( (collider) => {

					if ( collider.bodyType !== constants.DYNAMIC_BODY ) body.collideWith( collider );

				} );

				// if the body is the player, constrain the chain link it's attached to.

				if (
					body.isPlayer &&
					body.chain &&
					body.currentLink
				) {

					const linkID = ( body.chain.spheres.length ) - body.currentLink;

					body.chain.constrainLinkTo( linkID, body );

				}

			}

		} );

		//

		this.chains.forEach( chain => chain.resolve() );

	}

	//

	return world

}
