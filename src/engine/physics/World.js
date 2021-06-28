
/*

World is instantiated by the main thread. It is an object containing
entities, which are representation of physical bodies whose positions
are computed in the worked.

World is responsible for communicating with the worker and updating the
main thread entities according to the worker data. It will also dispatch
events coming from the worker.

*/

import * as THREE from 'three';

import params from '../params.js';
import core from '../core/core.js';
import events from '../misc/events.js';

import Entity from './Entity.js';
import ChainEntity from './ChainEntity.js';

//

export default function World( info, makeKinematicHelpers, makeStaticHelpers, makeMiscHelpers ) {

	const world = Object.assign(
		Object.create( new THREE.Group() ),
		{
			serial: Math.random() * 100000,
			isPaused: false,
			init,
			pause,
			resume,
			frame,
			clear,
			postUpdates,
			addChainLength,
			emitEvent,
			handleEvent,
			handleMessage,
			receivedEvents: [],
			worker: this.worker
		}
	);

	window.world = world;

	core.scene.add( world );

	world.init( info, makeKinematicHelpers, makeStaticHelpers, makeMiscHelpers );

	return world

}

//

function frame() {

	if ( !this.isPaused ) {

		core.render();

		this.postUpdates();

	}

}

function pause() {

	this.isPaused = true;

}

function resume() {

	this.isPaused = false;

	this.frame();

}

//

function postUpdates() {

	const chainPositions = this.chainTransferables.map( chainT => chainT.positions.buffer );

	this.worker.postMessage(
		{
			positions: this.positions,
			velocities: this.velocities,
			chains: this.chainTransferables,
			state: this.state
		},
		[
			this.positions.buffer,
			this.velocities.buffer,
			...chainPositions,
		]
	);

}

//

function addChainLength( lengthToAdd ) {

	const chainEntity = this.chains.find( chain => chain.active );

	chainEntity.addLength( lengthToAdd );

}

// EVENTS

function emitEvent( eventName, data ) {

	this.worker.postMessage( { isEvent: true, eventName, data } );

}

function handleEvent( e ) { events.emit( e.eventName, e.data ) }

// INIT

function init( info, makeKinematicHelpers , makeStaticHelpers, makeMiscHelpers ) {

	// keeps track of the nomber of entities the worker has to compute
	// physics for.
	info.serialCounter = 0;

	/////////////
	// ENTITIES
	/////////////

	// BODIES

	this.entities = info.bodies.map( (bodyInfo) => {

		bodyInfo.serial = info.serialCounter;
		info.serialCounter ++;

		const entity = Entity( bodyInfo );

		this.add( entity );

		if ( entity.isStatic && makeStaticHelpers ) entity.makeHelper();
		else if ( !entity.isStatic && makeKinematicHelpers ) entity.makeHelper();

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

	this.player = Entity( info.player );

	this.player.isPlayer = true;

	this.add( this.player );

	if ( makeMiscHelpers ) this.player.makeHelper();

	this.entities.push( this.player );

	// CHAIN POINTS

	this.chainEntities = [];

	this.chains = info.chainPoints.map( (cpInfo, i) => {

		cpInfo.chainID = i;

		const chainEntity = ChainEntity( cpInfo );

		if ( makeMiscHelpers ) {
			chainEntity.makeHelper();
			chainEntity.sphereEntities.forEach( c => c.makeHelper() );
		}

		// chain spheres are not added to entities, they are updated
		// by looping through a chainEntity.sphereEntities.

		this.chainEntities.push( chainEntity );

		if ( cpInfo.bodyName.length ) {

			this.getObjectByName( cpInfo.bodyName ).add( chainEntity )

		} else {

			this.add( chainEntity );

		}

		this.add( chainEntity.spheresContainer );

		// update info object so we are sure the web worker
		// will have the same chain

		cpInfo.pointsNumber = chainEntity.pointsNumber;
		cpInfo.linkLength = chainEntity.linkLength;
		cpInfo.spheresNumber = chainEntity.spheresNumber;
		cpInfo.active = chainEntity.active;

		return chainEntity

	} );

	this.chainTransferables = this.chains.map( (chainEntity) => {

		return {
			chainID: chainEntity.chainID,
			active: chainEntity.active,
			spheresNumber: chainEntity.spheresNumber,
			positions: new Float32Array( chainEntity.pointsNumber * 3 )
		}

	} );

	///////////
	// WORKER
	///////////

	// arrays that get transferred to and from the worker.
	this.positions = new Float32Array( info.serialCounter * 3 );
	this.velocities = new Float32Array( info.serialCounter * 3 );

	// set player position now that the typed arrays are created

	this.player.position.set(
		Number( info.player.x ),
		Number( info.player.y ),
		Number( info.player.z ),
	)

	this.player.setVectorArray(
		this.player.position.x,
		this.player.position.y,
		this.player.position.z,
		this.positions
	);

	this.player.setVectorArray(
		info.player.vel.x,
		info.player.vel.y,
		info.player.vel.z,
		this.velocities
	);

	// state parameters updated by the worker
	this.state = {
		playerIsColliding: false,
		playerIsOnGround: false,
		cameraTargetPos: new THREE.Vector3(
			Number( info.player.x ),
			Number( info.player.y ),
			Number( info.player.z )
		)
	}

	// tells the worker to create a new world.
	this.worker.postMessage( { info, state: this.state } );

	// initial kick of the messages loop.
	this.postUpdates();

	//

	this.worker.onmessage = (e) => this.handleMessage(e);

	// Linear interpolation between the entity position and the received position.
	// This smooth out most of the jittering.

	this.animateFn = () => {

		this.entities.forEach( (entity) => {

			entity.position.lerp( entity.targetPos, params.positionSmoothing );

			this.chains.forEach( (chain) => {

				chain.sphereEntities.forEach( sEntity => sEntity.position.lerp( sEntity.targetPos, 0.3 ) )

			} );

		});

	}

	core.callInLoop( this.animateFn );

}

//

function handleMessage(e) {

	if ( e.data.isEvent ) {

		const eventName = e.data.eventName;
		const data = e.data.data;

		this.receivedEvents.push( { eventName, data } )

	} else {

		// we must access the data first thing, or it's not actually transferred.

		this.positions = e.data.positions;
		this.velocities = e.data.velocities;
		this.chainTransferables = e.data.chains;
		this.state = e.data.state;

		// update chain entities

		for ( let i=0 ; i<this.chainTransferables.length ; i++ ) {

			if ( this.chainTransferables[i].active ) {

				// we check if the main thread updated the chain entity since the last frame.

				if ( this.chainTransferables[i].positions.length === this.chains[i].pointsNumber * 3 ) {

					this.chainEntities[i].active = true;
					this.chainEntities[i].spheresContainer.visible = true;
					this.chainEntities[i].updateFromArray( this.chainTransferables[i].positions );

				// if the main thread updated the chain entity length, we update the transferable
				// object accordingly.

				} else {

					const oldArray = this.chainTransferables[i].positions;
					const newArray = new Float32Array( this.chains[i].pointsNumber * 3 );

					for ( let i=0 ; i<oldArray.length ; i++ ) {
						newArray[i] = oldArray[i];
					}

					this.chainTransferables[i].spheresNumber = this.chains[i].spheresNumber
					this.chainTransferables[i].positions = newArray;

					// we add more info to the transferable object, because the
					// worker will need it.
					this.chainTransferables[i].length =  this.chains[i].length;

					this.chains[i].setPosArray( this.chainTransferables[i].positions );

				}

			} else {

				this.chainEntities[i].active = false;
				this.chainEntities[i].spheresContainer.visible = false;

			}

		}

		// update player state

		this.player.isOnGround = this.state.playerIsOnGround;
		this.player.isColliding = this.state.playerIsColliding;

		// update each entity with the new positions.

		this.entities.forEach( (entity) => {

			entity.updatePosition( this.positions );
			entity.updateVelocity( this.velocities )

		} );

		// handle events received from the worker

		for ( let i = this.receivedEvents.length-1; i>-1 ; i-- ) {
		
			this.handleEvent( this.receivedEvents[i] );

			this.receivedEvents.splice( i, 1 );

		}

		// update player with controls

		if ( this.controller ) this.controller();

		// render the updated scene and send a request for new data at 60 FPS.

		if ( !this.isCleared ) requestAnimationFrame( () => this.frame() )

	}

}

//

function clear() {

	if ( this.parent ) this.parent.remove( this );

	core.removeFromLoop( this.animateFn );

	this.entities.forEach( entity => entity.clear() );

	this.chains.forEach( chain => {

		chain.sphereEntities.forEach( entity => entity.clear() );

	} );

	this.isCleared = true;

}
