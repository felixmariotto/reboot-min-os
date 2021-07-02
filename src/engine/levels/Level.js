
import * as THREE from 'three';

import core from '../core/core.js';
import files from '../files/files.js';
import events from '../misc/events.js';
import physics from '../physics/physics.js';
import animationManager from '../graphics/animationManager.js';

import cameraControls from '../misc/cameraControls.js';
import characterControls from '../misc/characterControls.js';

import ChainPoint from '../graphics/objects/ChainPoint.js';
import ChainLink from '../graphics/objects/ChainLink.js';
import DialogueMarker from '../graphics/objects/DialogueMarker.js';

//

export default function Level( params ) {

	return Object.assign(
		{},
		{
			scene: new THREE.Scene(),
			start,
			clear,
			passGate,
			setEnvmap,
			addMeshes,
			routes: {}
		},
		params
	)

}

//

function start( makeKinematicHelpers, makeStaticHelpers, makeMiscHelpers ) {

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

			this.world = physics.World( sceneGraph, makeKinematicHelpers, makeStaticHelpers, makeMiscHelpers );

			animationManager.animateLevel( this );

			cameraControls.orbitWorldPlayer( this.world );
			characterControls.controlVelocity( this.world );

			this.scene.add( this.world );
			if ( staticModel ) this.scene.add( staticModel );

			//

			this.addMeshes();

			//

			resolve();

		} );

	} );

}

//

function setEnvmap( envmap ) {

	// cannot be level.scene because it's not the root
	core.scene.environment = envmap;
	core.scene.background = envmap;

}

//

function addMeshes() {

	// player

	files.models.player.then( ( model ) => {

		this.world.player.add( model );

	} );

	// chains and chain points

	this.world.chainEntities.forEach( (chainEntity) => {

		// chain points

		const cpObject = ChainPoint(
			chainEntity.radius,
			chainEntity.length
		);

		cpObject.position.copy( chainEntity.chainPointPos );

		chainEntity.parent.add( cpObject );

		// chains

		chainEntity.sphereEntities.forEach( (sphereEntity, idx) => {

			const link = ChainLink( idx );

			sphereEntity.add( link );

		} );

	} );

	//

	this.world.entities.forEach( (entity) => {

		// process entities with tags

		if ( Object.keys( entity.tags ).length ) {

			// dialogues

			if ( entity.tags.collectible.includes( 'dialogue' ) ) {

				const dialogueMarker = DialogueMarker();

				entity.add( dialogueMarker );

			}

		}

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
