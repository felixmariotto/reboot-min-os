
import * as THREE from 'three';

import core from '../core/core.js';
import physics from '../physics/physics.js';

import cameraControls from '../misc/cameraControls.js';
import characterControls from '../misc/characterControls.js';

//

export default function Level( playerInitPos, playerMotionOrigin ) {

	return {
		scene: new THREE.Scene(),
		start,
		clear,
		playerInitPos,
		playerMotionOrigin
	}

}

//

function start( makeKinematicHelpers, makeStaticHelpers ) {

	return new Promise( (resolve) => {

		core.scene.add( this.scene );

		Promise.all( [ this.mapFile, this.staticModel ] ).then( (results) => {

			const sceneGraph = results[0];
			const staticModel = results[1];

			// override the sceneGraph player position
			if ( this.playerInitPos ) {
				sceneGraph.player.x = this.playerInitPos[0];
				sceneGraph.player.y = this.playerInitPos[1];
				sceneGraph.player.z = this.playerInitPos[2];
			}

			// set player initial velocity
			sceneGraph.player.vel = new THREE.Vector3( 0, 0, 0 );
			if ( this.playerMotionOrigin ) {
				switch ( this.playerMotionOrigin ) {
					case '+x' : sceneGraph.player.vel.x -= 0.5; break
					case '-x' : sceneGraph.player.vel.x += 0.5; break
					case '+z' : sceneGraph.player.vel.z -= 0.5; break
					case '-z' : sceneGraph.player.vel.z += 0.5; break
				}
			}

			//

			this.world = physics.World( sceneGraph, makeKinematicHelpers, makeStaticHelpers );

			cameraControls.orbitWorldPlayer( this.world );
			characterControls.controlVelocity( this.world );

			this.scene.add( this.world );
			if ( staticModel ) this.scene.add( staticModel );

			resolve();

		} );

	} );

}

//

function clear() {

	core.scene.remove( this.scene );

	this.world.clear();

}
