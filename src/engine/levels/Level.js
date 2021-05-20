
import * as THREE from 'three';

import core from '../core/core.js';
import physics from '../physics/physics.js';

import cameraControls from '../misc/cameraControls.js';
import characterControls from '../misc/characterControls.js';

//

export default function Level() {

	return {
		scene: new THREE.Scene(),
		start
	}

}

//

function start( makeKinematicHelpers, makeStaticHelpers ) {

	core.scene.add( this.scene );

	this.mapFile.then( (sceneGraph) => {

		this.world = physics.World( sceneGraph, makeKinematicHelpers, makeStaticHelpers );

		cameraControls.orbitDynamicObj( this.world.player );

		characterControls.controlVelocity( this.world );

		this.scene.add( this.world );

	} );

	if ( this.staticModel ) {

		this.staticModel.then( (model) => {

			this.scene.add( model )

		} );

	}

}