
import physics from '../physics/physics.js';

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

		console.log( 'world', world )

		// engine.cameraControls.orbitDynamicObj( world.player );

		// engine.characterControls.controlVelocity( world );

	} );

}