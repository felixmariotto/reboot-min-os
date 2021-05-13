
import * as THREE from 'three';
import core from '../../core/core.js';
import params from '../../params.js';
import constants from '../../misc/constants.js';
import events from '../../misc/events.js';
import SpatialIndex from './SpatialIndex.js';

//

const MAX_DELTA = 1 / 30;
const NOMINAL_TICK_TIME = ( 1 / 60 ) / params.physicsSimTicks;

let nowTime, speedRatio;

const _vec = new THREE.Vector3();
const _zeroVec = new THREE.Vector3();

//

export default function World() {

	const world = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isWorld: true,
			enabled: true,
			chains: [],
			chainPoints: [],
			spatialIndex: SpatialIndex(),
			add,
			removeChain
		}
	);

	// to remove
	world.spatialIndex.world = world;

	// wrapper around THREE.Object3D.add

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

	const LOG_PERF = true;
	let counter = 0;

	/*
	core.callInLoop( ( delta ) => {

		if ( LOG_PERF ) {
			counter ++
			if ( counter % 60 === 0 ) console.time( 'world update' )
		}

		update.call( world, delta );

		if ( counter % 60 === 0 && LOG_PERF ) console.timeEnd( 'world update' )

	} );
	*/

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

			// loop through children for non physical updates

			this.children.forEach( (body) => {

				// if the body is a switch, we check its state to trigger
				// an event if necessary

				if ( body.tags && body.tags.isSwitch ) {

					let newState = false;

					const pos = body.position;
					const onPos = body.tags.switchPositions.on;
					const offPos = body.tags.switchPositions.off;

					if ( pos.distanceTo( onPos ) > pos.distanceTo( offPos ) ) {

						newState = true;

					}

					if ( newState !== body.tags.switchState ) {

						body.tags.switchState = newState;

						events.emit( 'switch-change', body );

					}

				}

			} );

		}

	}

	function updatePhysics( delta ) {

		// call every kinematic body transformation callback

		nowTime = Date.now();

		speedRatio = delta / NOMINAL_TICK_TIME;

		for ( let i=0 ; i<this.children.length ; i++ ) {

			const body = this.children[i];

			if (
				body.bodyType === constants.KINEMATIC_BODY &&
				body.updateTransform
			) {

				body.updateTransform( nowTime );

				body.lastTransformTime = nowTime;

			}

			// necessary to update the matrix for collision detection

			body.updateMatrixWorld();

			// collisions and physics

			if ( body.isChainPoint ) continue // we do want its matrixWorld udpated though

			if ( body.bodyType === constants.DYNAMIC_BODY ) {

				// reset these values, which will be set to true again if still on ground/colliding.
				// Used by characterControl.

				body.isOnGround = false;
				body.isColliding = false;
				body.isBlocked = false;

				// collide with static bodies via world.spatialIndex

				if ( !( body.tags && body.tags.dynamicOnly ) ) {

					body.collideIn( this, speedRatio );

				}

				// collide with all kinematic bodies

				this.children.forEach( (collider) => {

					if ( collider === body ) return

					if (
						collider.bodyType === constants.KINEMATIC_BODY ||
						(
							collider.bodyType === constants.DYNAMIC_BODY &&
							!( body.isPlayer && collider.isChainLink ) &&
							!( body.isChainLink && collider.isPlayer ) &&
							!( body.isChainLink && collider.isChainLink )
						)
					) {
						body.collideWith( collider, speedRatio );
					}

				} );

				// add gravity to velocity

				body.velocity.addScaledVector( params.gravity, ( 1 / params.physicsSimTicks ) * speedRatio * body.weight );

				if ( body.tags && body.tags.constraint ) {

					body.velocity.projectOnVector( body.tags.constraint );

				}

				// add force to velocity.
				// do not add if the force is already "contained" in the velocity.

				if ( body.force ) {

					_vec
					.copy( body.velocity )
					.projectOnVector( body.force )
					.sub( body.force )

					if ( _vec.dot( body.force ) < 1 ) {

						_vec
						.negate()
						.min( body.force );

						body.velocity.addScaledVector( _vec, ( 1 / params.physicsSimTicks ) * speedRatio * body.weight );

					}

				}

				// apply air drag if provided

				if ( body.tags && body.tags.airDrag ) {

					body.velocity.multiplyScalar( 1 - ( body.tags.airDrag / params.physicsSimTicks ) );

				}

				// update position according to velocity

				body.position.addScaledVector( body.velocity, speedRatio / params.physicsSimTicks );

				// constrain to movement direction and range

				body.constrain();

			}

		}

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