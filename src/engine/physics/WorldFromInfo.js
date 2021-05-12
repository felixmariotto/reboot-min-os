
import * as THREE from 'three';

import core from '../core/core.js';
import constants from '../misc/constants.js';

import World from './physicalObjects/World.js';
import Body from './physicalObjects/Body.js';
import Box from './physicalObjects/Box.js';
import Sphere from './physicalObjects/Sphere.js';
import Cylinder from './physicalObjects/Cylinder.js';
import Chain from './physicalObjects/Chain.js';
import ChainPoint from './physicalObjects/ChainPoint.js';
import Player from './physicalObjects/Player.js';

//

export default function WorldFromInfo( info ) {

	const world = World();

	core.scene.add( world );

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

			tags.constraint = new THREE.Vector3().copy( tags.constraint )

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

	//

	return {
		player,
		bodies,
		world
	}

}
