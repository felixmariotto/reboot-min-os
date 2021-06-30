
/*

WorkerWorld is only instantiated by the worker, it contains Bodies whose physical behavior
must be computed params.physicsSimTicks times per graphic frame.

WorkerWorld.update is called with various objects and typed arrays that must be updated
with the new world data, in order to be send to the main thread, which will update graphical
assets accordingly.

*/

import * as THREE from 'three';

import constants from '../../misc/constants.js';
import params from '../../params.js';

import Body from './Body.js';
import Box from './Box.js';
import Sphere from './Sphere.js';
import Cylinder from './Cylinder.js';
import ChainPoint from './ChainPoint.js';
import Player from './Player.js';
import Camera from './Camera.js';
import SpatialIndex from './SpatialIndex.js';

//

const MAX_DELTA = 1 / 30;
const NOMINAL_TICK_TIME = ( 1 / 60 ) / params.physicsSimTicks;

let nowTime, speedRatio;

const _vec = new THREE.Vector3();

//

export default function WorkerWorld( info ) {

	const world = Object.assign(
		Object.create( new THREE.Group() ),
		{
			isWorld: true,
			enabled: true,
			chains: [],
			chainPoints: [],
			spatialIndex: SpatialIndex(),
			info,
			update,
			updatePhysics,
			clear,
			handleEvent
		}
	)

	// bodies

	info.bodies.forEach( (bodyInfo) => {

		let bodyType = constants.STATIC_BODY;
		const tags = bodyInfo.tags ? JSON.parse( bodyInfo.tags ) : undefined;

		if ( bodyInfo.trans && bodyInfo.trans.length > 0 ) {

			bodyType = constants.KINEMATIC_BODY;

		} else if ( tags && tags.isDynamic ) {

			bodyType = constants.DYNAMIC_BODY;

		}

		const body = Body(
			bodyType,
			( tags && tags.weight ) ? tags.weight : undefined,
			( tags && tags.mass ) ? tags.mass : undefined
		);

		body.serial = bodyInfo.serial;

		if ( bodyInfo.trans ) {

			body.transformFunction = Function( 'time', bodyInfo.trans );

		}

		if ( tags && tags.constraint ) {

			tags.constraint = new THREE.Vector3().set(
				tags.constraint[0],
				tags.constraint[1],
				tags.constraint[2]
			);

		}

		// precompute the min and max vector according to the constraint
		
		if ( tags && tags.range ) {

			if ( !tags.constraint ) console.error('body must have a constraint to have a range')

			tags.range[0] = new THREE.Vector3()
			.copy( tags.constraint )
			.normalize()
			.multiplyScalar( tags.range[0] )

			tags.range[1] = new THREE.Vector3()
			.copy( tags.constraint )
			.normalize()
			.multiplyScalar( tags.range[1] )

		}

		// make a vector if the body must have a force

		if ( tags && tags.force ) {

			body.force = new THREE.Vector3(
				tags.force[0],
				tags.force[1],
				tags.force[2]
			);

		}

		// prepare the switch recorded position as "on" and "off"

		if (
			tags &&
			tags.range &&
			tags.force &&
			tags.isSwitch
		) {

			const arr = tags.range
			.slice(0)
			.sort( (a,b) => {
				return a.distanceTo( body.force ) - b.distanceTo( body.force )
			} );

			tags.switchPositions = {
				on: new THREE.Vector3().copy( arr[0] ),
				off: new THREE.Vector3().copy( arr[1] )
			};

		}

		//

		body.name = bodyInfo.name;

		if ( bodyInfo.tags ) body.tags = tags;

		//

		bodyInfo.shapes.forEach( (shapeInfo) => {

			let shape;

			switch ( shapeInfo.type ) {

				case 'box' :
					shape = Box( shapeInfo.width, shapeInfo.height, shapeInfo.depth );
					break

				case 'sphere' :
					shape = Sphere( shapeInfo.radius );
					break

				case 'cylinder' :
					shape = Cylinder( shapeInfo.radius, shapeInfo.height );
					break

			}

			shape.position.copy( shapeInfo.pos );
			shape.rotation.copy( shapeInfo.rot );

			body.add( shape );

			// add only the static bodies in a spatial index to
			// speed up the collision detection with dynamic bodies.

			if ( bodyType === constants.STATIC_BODY ) {

				world.spatialIndex.addShape( shape );

			}

		} );

		//

		world.add( body );

	} );

	// when all the static bodies are added to the world,
	// we compute the spatial index nodes.

	world.spatialIndex.computeTree();

	// camera

	world.camera = Camera();

	// necessary for collision
	world.add( world.camera );

	// player

	const player = Player();

	player.serial = info.player.serial;

	player.position.set(
		Number( info.player.x ),
		Number( info.player.y ),
		Number( info.player.z )
	);

	world.add( player );

	world.player = player;

	// chain points

	info.chainPoints.forEach( (cpInfo) => {

		const chainPoint = ChainPoint( cpInfo );

		world.chainPoints.push( chainPoint );

		if ( cpInfo.bodyName.length ) {

			world.getObjectByName( cpInfo.bodyName ).add( chainPoint )

		} else {

			world.add( chainPoint );

		}

		if ( cpInfo.active ) {

			const newChain = chainPoint.makeChain( player );

			world.chain = newChain;

			world.add( ...newChain.spheres );

		}

	} );

	//

	return world

}

//

function update( delta, positions, velocities, chains, state, events ) {

	if ( this.enabled ) {

		delta = Math.min( delta, MAX_DELTA );

		// update the position and velocity of all bodies
		// in case the main thread updated them.
		// Character control for instance update the player's
		// velocity in the main thread.

		this.children.forEach( (child) => {

			if (
				child.isChainLink ||
				child.isChainPoint ||
				child.isCamera
			) {
				return
			}

			child.updatePosFromArr( positions );
			child.updateVelFromArr( velocities );

		} );

		// if the size of the active chain changed in the main thread,
		// we update it here.

		if ( this.chain ) {

			chains.forEach( (chainInfo) => {

				if (
					chainInfo.chainID === this.chain.chainID &&
					chainInfo.spheresNumber !== this.chain.spheresNumber
				) {

					this.chain.addLength( chainInfo );

				}

			} );

		}

		// handle events stored after the last update.
		// we don't handle the events immediately on reception
		// because the snippet above erase everything with
		// the main thread data.

		for ( let i = events.length-1; i>-1 ; i-- ) {
			
			this.handleEvent( events[i] );

			events.splice( i, 1 );

		}

		// physics simulation, run several times for accuracy.

		for ( let i=0 ; i<params.physicsSimTicks ; i++ ) {

			this.updatePhysics( delta / params.physicsSimTicks );

		}

		// look for intersections between the player and chain points.

		this.chainPoints.forEach( (chainPoint) => {

			if (
				chainPoint.intersectPlayer( this.player ) &&
				( !this.chain || !this.chain.isAttachedTo( chainPoint ) )
			) {

				// first we detach the chain currently attached to the player.

				if ( this.chain ) {

					// update information sent to the main thread

					const chainInfo = chains[ this.chain.chainID ];

					chainInfo.active = false;

					//

					this.chain.clear();

					this.player.currentLink = 0;

				}

				// create a new chain attached to the player and the chainPoint

				this.chain = chainPoint.makeChain( this.player );

				this.add( ...this.chain.spheres );

				// update information sent to the main thread

				const chainInfo = chains[ this.chain.chainID ];

				chainInfo.active = true;

			}

		} );

		// loop through children for non physical updates and
		// transferable arrays updates.

		this.children.forEach( (body) => {

			if (
				body.isChainLink ||
				body.isChainPoint ||
				body.isCamera
			) {
				return
			}

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

					emitEvent( 'switch-change', {
						serial: body.serial,
						name: body.name,
						state: newState
					} )

				}

			}

			// update transferable arrays

			positions[ ( 3 * body.serial ) + 0 ] = body.position.x;
			positions[ ( 3 * body.serial ) + 1 ] = body.position.y;
			positions[ ( 3 * body.serial ) + 2 ] = body.position.z;

			velocities[ ( 3 * body.serial ) + 0 ] = body.velocity.x;
			velocities[ ( 3 * body.serial ) + 1 ] = body.velocity.y;
			velocities[ ( 3 * body.serial ) + 2 ] = body.velocity.z;

		} );

		// update chain information to send to the main thread

		if ( this.chain ) {

			const chainInfo = chains[ this.chain.chainID ];

			this.chain.updatePositionsArr( chainInfo.positions );

		}

		// update state to send to the main thread

		state.playerIsOnGround = this.player.isOnGround;
		state.playerIsColliding = this.player.isColliding;

		// update camera state

		this.camera.update( this, state.cameraTargetPos );

		// we want to allow the player to jump a short time after they
		// started falling ( also help because the player might quit the ground for 0.1s while runing )

		if ( this.player.isOnGround ) this.lastTimePlayerOnGround = Date.now();

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

		if (
			!body.isChainPoint && // we do want its matrixWorld udpated though
			body.bodyType === constants.DYNAMIC_BODY
		) {

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

	if ( this.chain ) this.chain.resolve()

}

//

function handleEvent( e ) {

	switch ( e.eventName ) {

		case 'jump' :

			if ( Date.now() < this.lastTimePlayerOnGround + params.jumpGiftDelay ) {

				this.player.velocity.y += params.playerJumpSpeed;

				emitEvent( 'player-jumped' );

			}

			break

		case 'pull' :
			
			if ( !this.player.chain ) return

			this.player.currentLink = Math.min(
				this.player.currentLink + 1,
				this.player.chain.spheres.length
			);

			break

		case 'release' :

			this.player.currentLink = 0;

			break

	}

}

//

function clear() {

	// console.warn('DELETE THIS WORLD FOR MEMORY')

}
