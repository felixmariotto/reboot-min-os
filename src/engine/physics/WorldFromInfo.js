
import core from '../core/core.js';
import constants from '../misc/constants.js';

import World from './physicalObjects/World.js';
import Body from './physicalObjects/Body.js';
import Box from './physicalObjects/Box.js';
import Sphere from './physicalObjects/Sphere.js';
import Cylinder from './physicalObjects/Cylinder.js';
import Chain from './physicalObjects/Chain.js';
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

		} );

		//

		world.add( body );

	} );

	// hero

	const player = Player();

	player.position.set(
		Number( info.hero.x ),
		Number( info.hero.y ),
		Number( info.hero.z )
	);

	world.add( player );

	// chain

	const chain = Chain( Number( info.chain.length ) );
	chain.makeHelper();

	const anchorBody = world.getObjectByName( info.chain.start.bodyName );

	chain.attachStartTo(
		anchorBody,
		Number( info.chain.start.x ),
		Number( info.chain.start.y ),
		Number( info.chain.start.z )
	);

	chain.attachEndTo(
		player,
		Number( info.chain.end.x ),
		Number( info.chain.end.y ),
		Number( info.chain.end.z )
	);

	world.chains.push( chain );
	world.add( ...chain.spheres );

	//

	return {
		player
	}

}
