
import * as THREE from 'three';

import core from '../core/core.js';
import constants from '../misc/constants.js';
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

	world.chains = info.chainPoints.map( (cpInfo, i) => {

		const chainEntity = ChainEntity( cpInfo );

		world.add( chainEntity );

		for ( let j=0 ; j<chainEntity.spheresNumber ; j++ ) {

			const sphereEntity = Entity({
				name: 'chain-link-' + i + '-' + j,
				info: info.serialCounter,
				shapes: [ {
					type: "sphere",
					radius: params.chainSphereRadius,
					pos: { x: 0, y: 0, z: 0 },
					rot: { _x: 0, _y: 0, _z: 0, _order: "XYZ" }
				} ]
			});

			info.serialCounter ++;

			chainEntity.sphereEntities.push( sphereEntity );

			chainEntity.add( sphereEntity );

			sphereEntity.makeHelper();

			entities.push( sphereEntity );

		}

		return chainEntity

	} );

	world.chainTransferables = world.chains.map( (chainEntity, i) => {

		return {
			id: i,
			active: chainEntity.active,
			spheresNumber: chainEntity.spheresNumber,
			positions: new Float32Array( chainEntity.spheresNumber * 3 ),
			velocities: new Float32Array( chainEntity.spheresNumber * 3 )
		}

	} );







	///////////
	// WORKER
	///////////

	const clock = new THREE.Clock();
	const targetDt = 1 / 60;

	// arrays that get transferred to and from the worker.
	world.positions = new Float32Array( info.serialCounter * 3 );
	world.velocities = new Float32Array( info.serialCounter * 3 );

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
		const chainVelocities = world.chainTransferables.map( chainT => chainT.velocities.buffer );

		this.worker.postMessage(
			{
				positions: world.positions,
				velocities: world.velocities,
				chains: world.chainTransferables
			},
			[
				world.positions.buffer,
				world.velocities.buffer,
				...chainPositions,
				...chainVelocities
			]
		);

	}

	postUpdates();

	this.worker.onmessage = function (e) {

		// we must access the data first thing, or it's not actually transferred.
		world.positions = e.data.positions;
		world.velocities = e.data.velocities;
		world.chainTransferables = e.data.chains;

		// delta time since last this function last call.
		const dt = clock.getDelta();

		// compute the delay to post message to the worker at 60 frame per second.
		const delay = Math.max( 0, ( targetDt - dt ) * 1000 );

		// update each entity with the new positions.
		entities.forEach( (entity) => {

			entity.updatePosition( world.positions );
			entity.updateVelocity( world.velocities )

		} );

		// update player with controls
		if ( world.controller ) world.controller();

		// re-transfer the position array buffer to the worker.
		setTimeout( postUpdates, delay );

	}

	//










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
