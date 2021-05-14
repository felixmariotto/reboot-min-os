
import * as THREE from 'three';

import core from '../core/core.js';
import constants from '../misc/constants.js';
import events from '../misc/events.js';
import params from '../params.js';

/*
import World from './workerObjects/World.js';
import Body from './workerObjects/Body.js';
import Box from './workerObjects/Box.js';
import Sphere from './workerObjects/Sphere.js';
import Cylinder from './workerObjects/Cylinder.js';
import Chain from './workerObjects/Chain.js';
import ChainPoint from './workerObjects/ChainPoint.js';
import Player from './workerObjects/Player.js';
*/

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

	core.scene.add( world );

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

	const receivedEvents = [];

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

			// compute the delay to post message to the worker at 60 frame per second.

			const delay = Math.max( 0, ( targetDt - dt ) * 1000 );

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

	//

	world.emitEvent = ( eventName, data ) => {

		this.worker.postMessage( { isEvent: true, eventName, data } );

	}

	function handleEvent( e ) {

		events.emit( e.eventName, e.data );

	}








	/*

	// bodies

	const bodies = info.bodies.map( (bodyInfo) => {

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
					shape.makeHelper();
					break

				case 'sphere' :
					shape = Sphere( shapeInfo.radius );
					shape.makeHelper();
					break

				case 'cylinder' :
					shape = Cylinder( shapeInfo.radius, shapeInfo.height );
					shape.makeHelper();
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

		return body

	} );

	// when all the static bodies are added to the world,
	// we compute the spatial index nodes.

	world.spatialIndex.computeTree();

	// player

	const player = Player();

	player.position.set(
		Number( info.player.x ),
		Number( info.player.y ),
		Number( info.player.z )
	);

	world.add( player );

	// chain points

	info.chainPoints.forEach( (cpInfo) => {

		const chainPoint = ChainPoint();

		chainPoint.chainLength = Number( cpInfo.length );
		chainPoint.radius = Number( cpInfo.radius );

		chainPoint.makeHelper();

		chainPoint.position.set(
			Number( cpInfo.x ),
			Number( cpInfo.y ),
			Number( cpInfo.z )
		);

		world.chainPoints.push( chainPoint );

		if ( cpInfo.bodyName.length ) {

			world.getObjectByName( cpInfo.bodyName ).add( chainPoint )

		} else {

			world.add( chainPoint );

		}

		if ( cpInfo.init ) {

			const newChain = chainPoint.makeChain( player );

			world.chains.push( newChain );

			world.add( ...newChain.spheres );

		}

	} );

	*/

	//

	return world

}
