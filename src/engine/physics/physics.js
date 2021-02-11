
import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';

import core from '../core/core.js';
import physicalObjects from './physicalObjects.js';
import collide from './collide.js';

// article on chain physics :
// https://stackoverflow.com/questions/42609279/how-to-simulate-chain-physics-game-design/42618200

// Add the raycast function. Assumes the BVH is available on
// the `boundsTree` variable
THREE.Mesh.prototype.raycast = acceleratedRaycast;

//

// number of simulation steps per graphic frame
const TICKS_PER_FRAME = 5;
const MAX_TICKS_PER_FRAME = 15;

const GRAVITY = new THREE.Vector3( 0, -0.0005, 0 );

const playerVelocity = new THREE.Vector3();

let playerIsOnGround = false;
const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();
const _box = new THREE.Box3();
const _mat = new THREE.Matrix4();
const _line = new THREE.Line3();

let ticks, speedRatio;
let environment, playerCapsule;

//

function setEnvironmentGeom( geometry ) {

	environment = physicalObjects.makeMesh( geometry );

	return environment

}

function makePlayerCapsule( radius, height ) {

	playerCapsule = physicalObjects.makeCapsule( radius, height );

	return playerCapsule

}

function makePhysicalMesh( geometry ) {

	const mesh = physicalObjects.makeMesh( geometry );

	return mesh

}

//

function updatePhysics( delta ) {

	speedRatio = delta / ( ( 1 / 60 ) / TICKS_PER_FRAME );
	speedRatio = Math.min( speedRatio, 2 );

	if ( playerCapsule && environment ) {

		// add gravity to objects velocity

		playerVelocity.addScaledVector( GRAVITY, speedRatio );

		// update objects position

		playerCapsule.position.addScaledVector( playerVelocity, speedRatio );

		playerCapsule.updateMatrix();

		playerCapsule.updateMatrixWorld();

	}

	// collide objects
	// blind paste from https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/characterMovement.js

	if ( playerCapsule && environment ) {

		collide.capsuleAgainstMesh( playerCapsule, environment, _line );

		const newPosition = _vec1;
		newPosition.copy( _line.start ).applyMatrix4( environment.matrixWorld );

		const deltaVector = _vec2;
		deltaVector.subVectors( newPosition, playerCapsule.position );

		playerCapsule.position.copy( newPosition );

		playerIsOnGround = deltaVector.y > Math.abs( delta * playerVelocity.y * 0.25 );

		if ( ! playerIsOnGround ) {

			deltaVector.normalize();
			playerVelocity.addScaledVector( deltaVector, - deltaVector.dot( playerVelocity ) );

		} else {

			playerVelocity.set( 0, 0, 0 );

		}

	}

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
	setEnvironmentGeom,
	makePlayerCapsule,
	makePhysicalMesh,
	makeCapsule: physicalObjects.makeCapsule
}
