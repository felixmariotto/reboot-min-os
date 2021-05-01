
import * as THREE from 'three';
import core from '../../core/core.js';
import params from '../../params.js';
import constants from '../../misc/constants.js';

//

const MAX_DELTA = 1 / 30;
const NOMINAL_TICK_TIME = ( 1 / 60 ) / params.physicsSimTicks;

let nowTime;

//

export default function World() {

	const world = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isWorld: true,
			enabled: true,
			chains: [],
			chainPoints: [],
			add,
			removeChain
		}
	);

	//

	function add() {

		for ( const id of Object.keys(arguments) ) {

			if (
				!arguments[id].isBody &&
				!arguments[id].isChainPoint
			) {
				console.warn( 'an object that is not a body nor a chain point was added to the world' )
			}

			if ( arguments[id].isPlayer ) this.player = arguments[id];

		}

		return Object.getPrototypeOf( this ).add.call( this, ...arguments );

	}

	//

	function removeChain( chain ) {

		this.chains.splice( this.chains.indexOf( chain ), 1 );

		chain.clear();

	}

	//

	core.callInLoop( ( delta ) => {

		update.call( world, delta );

	} );

	function update( delta ) {

		if ( this.enabled ) {

			for ( let i=0 ; i<params.physicsSimTicks ; i++ ) {

				updatePhysics.call( world, Math.min( delta, MAX_DELTA ) / params.physicsSimTicks );

			}

			// look for intersections between the player and chain points

			this.chainPoints.forEach( (chainPoint) => {

				if (
					chainPoint.intersectPlayer( this.player ) &&
					!world.chains.some( chain => chain.isAttachedTo( chainPoint ) )
				) {

					// first we detach the chain currently attached to the player

					const oldChain = world.chains.find( chain => chain.isAttachedTo( this.player ) );

					if ( oldChain ) this.removeChain( oldChain );

					// create a new chain attached to the player and the chainPoint

					const newChain = chainPoint.makeChain( this.player );

					world.chains.push( newChain );

					world.add( ...newChain.spheres );

				}

			} );

		}

	}

	function updatePhysics( delta ) {

		// call every kinematic body transformation callback

		nowTime = Date.now();

		this.children.forEach( (body) => {

			if (
				body.bodyType === constants.KINEMATIC_BODY &&
				body.updateTransform
			) {

				body.updateTransform( nowTime );

				body.lastTransformTime = nowTime;

			}

			// necessary to update the matrix for collision detection

			body.updateMatrixWorld();

		} );

		// collisions and physics

		this.children.forEach( (body) => {

			if ( body.isChainPoint ) return

			if ( body.bodyType === constants.DYNAMIC_BODY ) {

				// reset these values, which will be set to true again if still on ground/colliding.
				// Used by characterControl.

				body.isOnGround = false;
				body.isColliding = false;

				// collide with non-dynamic bodies

				this.children.forEach( (collider) => {

					if ( collider.bodyType !== constants.DYNAMIC_BODY ) body.collideWith( collider );

				} );

				// add gravity to velocity

				body.velocity.addScaledVector( params.gravity, ( 1 / params.physicsSimTicks ) * ( delta / NOMINAL_TICK_TIME ) * body.mass );

				// update position according to velocity

				body.position.addScaledVector( body.velocity, ( delta / NOMINAL_TICK_TIME ) / params.physicsSimTicks );

			}

		} );

		// if the world own a player and they are climbing along the chain,
		// constrain the chain link it's attached to.

		if (
			this.player &&
			this.player.chain &&
			this.player.currentLink
		) {

			const linkID = ( this.player.chain.spheres.length ) - this.player.currentLink;

			this.player.chain.constrainLinkTo( linkID, this.player );

		}

		// constrain chain links back to max distance

		this.chains.forEach( chain => chain.resolve() );

	}

	//

	return world

}
