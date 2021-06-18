
import * as THREE from 'three';

import core from '../core/core.js';
import events from '../misc/events.js';
import physics from '../physics/physics.js';

import cameraControls from '../misc/cameraControls.js';
import characterControls from '../misc/characterControls.js';

//

export default function Level( params ) {

	return Object.assign(
		{},
		{
			scene: new THREE.Scene(),
			start,
			clear,
			passGate,
			routes: {}
		},
		params
	)

}

//

function start( makeKinematicHelpers, makeStaticHelpers ) {

	return new Promise( (resolve) => {

		core.scene.add( this.scene );

		Promise.all( [ this.mapFile, this.staticModel ] ).then( (results) => {

			const sceneGraph = results[0];
			const staticModel = results[1];

			// override the level initial chain point
			if ( this.chainID !== undefined ) {
				sceneGraph.chainPoints.forEach( cp => cp.init = false );
				sceneGraph.chainPoints[ this.chainID ].init = true;
			}

			// override the sceneGraph player position
			if ( this.playerInit ) {
				sceneGraph.player.x = this.playerInit[0];
				sceneGraph.player.y = this.playerInit[1];
				sceneGraph.player.z = this.playerInit[2];
			}

			// set player initial velocity
			sceneGraph.player.vel = new THREE.Vector3( 0, 0, 0 );

			if ( this.playerDir ) {
				switch ( this.playerDir ) {
					case '+x' : sceneGraph.player.vel.x += 0.5; break
					case '-x' : sceneGraph.player.vel.x -= 0.5; break
					case '+z' : sceneGraph.player.vel.z += 0.5; break
					case '-z' : sceneGraph.player.vel.z -= 0.5; break
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

function passGate( gateName ) {

	if ( this.routes[ gateName ] ) {

		events.emit( 'load-level', this.routes[ gateName ] );

	} else {

		console.warn( "this level doesn't have a route ", gateName );

	}

}

//

function clear() {

	core.scene.remove( this.scene );

	this.world.clear();

}
