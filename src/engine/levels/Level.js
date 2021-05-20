
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

		this.world = physics.World( sceneGraph );

		cameraControls.orbitDynamicObj( this.world.player );

		characterControls.controlVelocity( this.world );

	} );

	if ( this.staticModel ) {

		this.staticModel.then( (model) => {

			this.world.add( model )

		} );

	}

}