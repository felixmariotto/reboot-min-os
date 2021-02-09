
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';

import threeCore from '../core/threeCore.js';

// Add the raycast function. Assumes the BVH is available on
// the `boundsTree` variable
THREE.Mesh.prototype.raycast = acceleratedRaycast;

//

// number of simulation steps per graphic frame
const TICKS_PER_FRAME = 5;
const MAX_TICKS_PER_FRAME = 15;

const GRAVITY = new THREE.Vector3( 0, -0.00005, 0 );

const playerVelocity = new THREE.Vector3();

let ticks, speedRatio;
let environment, playerCapsule;

//

function setEnvironmentGeom( geometry ) {

	geometry = geometry.clone();

	geometry.boundsTree = new MeshBVH( geometry );

	environment = new THREE.Mesh( geometry );

	/*
	const collider = new THREE.Mesh( environmentGeom, new THREE.MeshBasicMaterial() );
	collider.material.wireframe = true;
	threeCore.scene.add( collider );
	*/

}

function makePlayerCapsule( radius, height ) {

	const geometry = new RoundedBoxGeometry(
		radius * 2, // width
		height,
		radius * 2, // depth
		16, // segments
		radius
	)

	geometry.translate( 0, height * 0.5, 0 );

	geometry.boundsTree = new MeshBVH( geometry );

	playerCapsule = new THREE.Mesh( geometry );

	// helper

	playerCapsule.material = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 0.5
	});

	threeCore.scene.add( playerCapsule );

	return playerCapsule

}

//

function updatePhysics( delta ) {

	speedRatio = delta / ( ( 1 / 60 ) / TICKS_PER_FRAME );
	speedRatio = Math.min( speedRatio, 2 );

	// add gravity to objects velocity

	playerVelocity.addScaledVector( GRAVITY, speedRatio );

	// update objects position

	if ( playerCapsule ) {

		playerCapsule.position.addScaledVector( playerVelocity, speedRatio );

		playerCapsule.updateMatrix();

	}

	// collide objects

	if ( playerCapsule ) {

		if (
			environment &&
			environment.geometry.boundsTree.intersectsGeometry(
				playerCapsule,
				playerCapsule.geometry,
				playerCapsule.matrix
			)
		) {
			playerCapsule.position.addScaledVector( playerVelocity, -speedRatio );
		}

	}

}

/*
Register the update function to the game loop.
The update function calls updatePhysics several times per frame, in order
to avoid tunneling.
*/

threeCore.callInLoop( function ( delta ) {

	ticks = Math.round( ( delta / ( 1 / 60 ) ) * TICKS_PER_FRAME );

	ticks = Math.min( ticks, MAX_TICKS_PER_FRAME );

	for ( let i = 0 ; i < ticks ; i++ ) {

		updatePhysics( delta / ticks );

	};

});

//

export default {
	setEnvironmentGeom,
	makePlayerCapsule
}
