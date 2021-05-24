
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

	return new Promise( (resolve) => {

		core.scene.add( this.scene );

		Promise.all( [ this.mapFile, this.staticModel ] ).then( (results) => {

			const sceneGraph = results[0];
			const staticModel = results[1];

			this.world = physics.World( sceneGraph, makeKinematicHelpers, makeStaticHelpers );

			cameraControls.orbitDynamicObj( this.world.player );

			characterControls.controlVelocity( this.world );

			this.scene.add( this.world, staticModel );

			resolve();

		} );

	} );

}
