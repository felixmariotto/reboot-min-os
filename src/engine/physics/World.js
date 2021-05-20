
/*

World is instantiated by the main thread. It is an object containing
entities, which are representation of physical bodies whose positions
are computed in the worked.

World is responsible for communicating with the worker and updating the
main thread entities according to the worker data. It will also dispatch
events coming from the worker.

*/

import * as THREE from 'three';

import core from '../core/core.js';
import constants from '../misc/constants.js';
import events from '../misc/events.js';
import params from '../params.js';

import Entity from './Entity.js';
import ChainEntity from './ChainEntity.js';

//

export default function World( info ) {

	// keeps track of the nomber of entities the worker has to compute
	// physics for.
	info.serialCounter = 0;

	// create a shallow world. In this main thread world we compute no physics,
	// but we update entities position and state every time the worker send a
	// message.

	const world = new THREE.Group();

	/////////////
	// ENTITIES
	/////////////

	// BODIES

	const entities = info.bodies.map( (bodyInfo) => {

		bodyInfo.serial = info.serialCounter;
		info.serialCounter ++;

		const entity = Entity( bodyInfo );

		world.add( entity );

		entity.makeHelper();

		return entity

	} );

	// PLAYER

	info.player.name = 'player';
	info.player.shapes = [ {
		type: "sphere",
		radius: 1,
		pos: { x: 0, y: 0, z: 0 },
		rot: { _x: 0, _y: 0, _z: 0, _order: "XYZ" }
	} ];
	info.player.serial = info.serialCounter;
	info.serialCounter ++;

	world.player = Entity( info.player );

	world.player.isPlayer = true;

	world.add( world.player );

	world.player.makeHelper();

	entities.push( world.player );

	// CHAIN POINTS

	const chainEntities = [];

	world.chains = info.chainPoints.map( (cpInfo, i) => {

		cpInfo.chainID = i;

		const chainEntity = ChainEntity( cpInfo );

		chainEntity.makeHelper();

		// chain spheres are not added to entities, they are updated
		// by looping through a chainEntity.sphereEntities.

		chainEntities.push( chainEntity );

		if ( cpInfo.bodyName.length ) {

			world.getObjectByName( cpInfo.bodyName ).add( chainEntity )

		} else {

			world.add( chainEntity );

		}

		world.add( chainEntity.spheresContainer );

		// update info object so we are sure the web worker
		// will have the same chain

		cpInfo.pointsNumber = chainEntity.pointsNumber;
		cpInfo.linkLength = chainEntity.linkLength;
		cpInfo.spheresNumber = chainEntity.spheresNumber;
		cpInfo.active = chainEntity.active;

		return chainEntity

	} );

	world.chainTransferables = world.chains.map( (chainEntity, i) => {

		return {
			chainID: chainEntity.chainID,
			active: chainEntity.active,
			spheresNumber: chainEntity.spheresNumber,
			positions: new Float32Array( chainEntity.pointsNumber * 3 )
		}

	} );

	world.addChainLength = function addChainLength( lengthToAdd ) {

		const chainEntity = world.chains.find( chain => chain.active );
		const chainTransferable = world.chainTransferables.find( chain => chain.active );

		chainEntity.addLength( lengthToAdd );

	}

	///////////
	// WORKER
	///////////

	const clock = new THREE.Clock();
	const targetDt = 1 / 60;

	// arrays that get transferred to and from the worker.
	world.positions = new Float32Array( info.serialCounter * 3 );
	world.velocities = new Float32Array( info.serialCounter * 3 );

	// state parameters updated by the worker
	world.state = {
		playerIsColliding: false,
		playerIsOnGround: false
	}

	// set player position now that the typed arrays are created
	world.player.setVectorArray(
		Number( info.player.x ),
		Number( info.player.y ),
		Number( info.player.z ),
		world.positions
	);

	// tells the worker to create a new world.
	this.worker.postMessage( { info } );

	// initial kick of the messages loop.
	const postUpdates = () => {

		const chainPositions = world.chainTransferables.map( chainT => chainT.positions.buffer );

		this.worker.postMessage(
			{
				positions: world.positions,
				velocities: world.velocities,
				chains: world.chainTransferables,
				state: world.state
			},
			[
				world.positions.buffer,
				world.velocities.buffer,
				...chainPositions,
			]
		);

	}

	postUpdates();

	//

	const receivedEvents = [];

	world.emitEvent = ( eventName, data ) => {

		this.worker.postMessage( { isEvent: true, eventName, data } );

	}

	function handleEvent( e ) { events.emit( e.eventName, e.data ) }

	//

	this.worker.onmessage = function (e) {

		if ( e.data.isEvent ) {

			const eventName = e.data.eventName;
			const data = e.data.data;

			receivedEvents.push( { eventName, data } )

		} else {

			// we must access the data first thing, or it's not actually transferred.

			world.positions = e.data.positions;
			world.velocities = e.data.velocities;
			world.chainTransferables = e.data.chains;
			world.state = e.data.state;

			// delta time since this function last call.

			const dt = clock.getDelta();

			// compute the delay to post message to the worker at 60 frames per second.

			const delay = Math.max( 0, ( targetDt - dt ) * 1000 );

			// update chain entities

			for ( let i=0 ; i<world.chainTransferables.length ; i++ ) {

				if ( world.chainTransferables[i].active ) {

					// we check if the main thread updated the chain entity since the last frame.

					if ( world.chainTransferables[i].positions.length === world.chains[i].pointsNumber * 3 ) {

						chainEntities[i].active = true;
						chainEntities[i].spheresContainer.visible = true;
						chainEntities[i].updateFromArray( world.chainTransferables[i].positions );

					// if the main thread updated the chain entity length, we update the transferable
					// object accordingly.

					} else {

						const oldArray = world.chainTransferables[i].positions;
						const newArray = new Float32Array( world.chains[i].pointsNumber * 3 );

						for ( let i=0 ; i<oldArray.length ; i++ ) {
							newArray[i] = oldArray[i];
						}

						world.chainTransferables[i].spheresNumber = world.chains[i].spheresNumber
						world.chainTransferables[i].positions = newArray;

						// we add more info to the transferable object, because the
						// worker will need it.
						world.chainTransferables[i].length =  world.chains[i].length;

						world.chains[i].setPosArray( world.chainTransferables[i].positions );

					}

				} else {

					chainEntities[i].active = false;
					chainEntities[i].spheresContainer.visible = false;

				}

			}

			// update player state

			world.player.isOnGround = world.state.playerIsOnGround;
			world.player.isColliding = world.state.playerIsColliding;

			// update each entity with the new positions.

			entities.forEach( (entity) => {

				entity.updatePosition( world.positions );
				entity.updateVelocity( world.velocities )

			} );

			// handle events received from the worker

			for ( let i = receivedEvents.length-1; i>-1 ; i-- ) {
			
				handleEvent( receivedEvents[i] );

				receivedEvents.splice( i, 1 );

			}

			// update player with controls

			if ( world.controller ) world.controller();

			// re-transfer the data to the worker.

			setTimeout( postUpdates, delay );

		}

	}

	// Linear interpolation between the entity position and the received position.
	// This smooth out most of the jittering.

	core.callInLoop( () => {

		entities.forEach( (entity) => {

			entity.position.lerp( entity.targetPos, 0.3 );

			world.chains.forEach( (chain) => {

				chain.sphereEntities.forEach( sEntity => sEntity.position.lerp( sEntity.targetPos, 0.3 ) )

			} );

		});

	} );

	//

	return world

}
