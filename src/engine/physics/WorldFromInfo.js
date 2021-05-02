
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

	info.bodies.forEach( (bodyInfo) => {

		let bodyType = constants.STATIC_BODY;

		if (
			bodyInfo.trans &&
			bodyInfo.trans.length > 0
		) {
			bodyType = constants.KINEMATIC_BODY;
		}

		const body = Body( bodyType );

		body.transformCode = bodyInfo.trans;
		body.name = bodyInfo.name;

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

	} );

	// when all the static bodies are added to the world,
	// we compute the spatial index nodes.

	world.spatialIndex.computeTree();

	console.log( world.spatialIndex );

	// const helper = new THREE.Box3Helper( world.spatialIndex.root, 0xffff00 );
	// world.add( helper );


	// player

	const player = Player();

	player.position.set(
		Number( info.hero.x ),
		Number( info.hero.y ),
		Number( info.hero.z )
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
		player
	}

}
