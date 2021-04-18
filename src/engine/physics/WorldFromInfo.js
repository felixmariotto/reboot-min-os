
import constants from '../misc/constants.js';

import World from './physicalObjects/World.js';
import Body from './physicalObjects/Body.js';
import Box from './physicalObjects/Box.js';

//

export default function WorldFromInfo( sceneGraph ) {

	const world = World();

	sceneGraph.forEach( (bodyInfo) => {

		let bodyType = constants.STATIC_BODY;

		if (
			bodyInfo.trans &&
			bodyInfo.trans.length > 0
		) {
			bodyType = constants.KINEMATIC_BODY;
		}

		const body = Body( bodyType );

		body.transformCode = bodyInfo.trans;

		//

		bodyInfo.shapes.forEach( (shapeInfo) => {

			let shape;

			switch ( shapeInfo.type ) {

				case 'box' :
					shape = Box( shapeInfo.width, shapeInfo.height, shapeInfo.depth );
					break

			}

			shape.position.copy( shapeInfo.pos );
			shape.rotation.copy( shapeInfo.rot );

			body.add( shape );

		} );

		//

		world.add( body );

	} );

	//

	return world

}