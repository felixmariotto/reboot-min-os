
import * as THREE from 'three';

import core from '../core/core.js';
import physicalObjects from './physicalObjects.js';
import collide from './collide.js';

// article on chain physics :
// https://stackoverflow.com/questions/42609279/how-to-simulate-chain-physics-game-design/42618200

//

// number of simulation steps per graphic frame
const TICKS_PER_FRAME = 5;
const MAX_TICKS_PER_FRAME = 15;

const GRAVITY = new THREE.Vector3( 0, -0.025, 0 );

let isOnGround = false;
const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const _line = new THREE.Line3();

let ticks, speedRatio;
let environment;

const objectsToUpdate = [];

//

function makeEnvironmentMesh( geometry ) {

	environment = physicalObjects.makeMesh( geometry );

	return environment

}

function makePhysicalCapsule( radius, height ) {

	const capsule = physicalObjects.makeCapsule( radius, height );

	objectsToUpdate.push( capsule );

	return capsule

}

function makePhysicalMesh( geometry ) {

	const mesh = physicalObjects.makeMesh( geometry );

	objectsToUpdate.push( mesh );

	return mesh

}

//

function updatePhysics( delta ) {

	speedRatio = delta / ( 1 / 60 );
	speedRatio = Math.min( speedRatio, 2 );

	if ( environment ) {

		objectsToUpdate.forEach( (physicalMesh) => {

			if ( physicalMesh.isCapsule ) {

				resolveCapsule( physicalMesh, speedRatio );

			}

		});

	}

}

//

function resolveCapsule( capsule, speedRatio ) {



}

/*
Register the update function to the game loop.
The update function calls updatePhysics several times per frame, in order
to avoid tunneling.
*/

core.callInLoop( function ( delta ) {

	ticks = Math.round( ( delta / ( 1 / 60 ) ) * TICKS_PER_FRAME );

	ticks = Math.min( ticks, MAX_TICKS_PER_FRAME );

	for ( let i = 0 ; i < ticks ; i++ ) {

		updatePhysics( delta / ticks );

	};

});

//

export default {
	makeEnvironmentMesh,
	makePhysicalCapsule,
	makePhysicalMesh
}
