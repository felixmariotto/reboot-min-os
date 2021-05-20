
import physics from '../physics/physics.js';

import cameraControls from '../misc/cameraControls.js';
import characterControls from '../misc/characterControls.js';

//

export default function Level() {

	return {
		start
	}

}

//

function start() {

	this.mapFile.then( (sceneGraph) => {

		const world = physics.World( sceneGraph );

		cameraControls.orbitDynamicObj( world.player );

		characterControls.controlVelocity( world );

	} );

}