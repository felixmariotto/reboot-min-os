
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import core from '../core/core.js';

// article on chain physics :
// https://stackoverflow.com/questions/42609279/how-to-simulate-chain-physics-game-design/42618200

const world = new CANNON.World();

world.gravity.set(0, -20, 0)

const helperMaterial = new THREE.MeshNormalMaterial({
	wireframe: true
});

const physicsMaterial = new CANNON.Material('physics');

const physics_physics = new CANNON.ContactMaterial(physicsMaterial, physicsMaterial, {
	friction: 0.0,
	restitution: 0.3
})

// We must add the contact materials to the world
world.addContactMaterial( physics_physics );

const objectsToUpdate = [];

//

function makePhysicalBox( options ) {

	// CANNON

	const shape = new CANNON.Box(
		new CANNON.Vec3(
			options.width * 0.5,
			options.height * 0.5,
			options.depth * 0.5
		)
	);

	const body = new CANNON.Body({
		mass: options.mass,
		material: physicsMaterial
	});

	body.addShape( shape );

	world.addBody( body );

	// THREE

	const geometry = new THREE.BoxGeometry(
		options.width,
		options.height,
		options.depth
	);

	const mesh = new THREE.Mesh( geometry, helperMaterial );

	core.scene.add( mesh );

	//

	mesh.body = body;

	mesh.moveTo = moveTo;

	objectsToUpdate.push( mesh );

	//

	return mesh

}

//

function makePhysicalSphere( options ) {

	// CANNON

	const shape = new CANNON.Sphere( options.radius );

	const body = new CANNON.Body({
		mass: options.mass,
		material: physicsMaterial
	});

	body.addShape( shape );

	world.addBody( body );

	// THREE

	const geometry = new THREE.IcosahedronGeometry(
		options.radius,
		3
	);

	const mesh = new THREE.Mesh( geometry, helperMaterial );

	core.scene.add( mesh );

	//

	mesh.body = body;

	mesh.moveTo = moveTo;

	objectsToUpdate.push( mesh );

	//

	return mesh

}

//

function moveTo( x, y, z ) {

	this.body.position.set( x, y, z );

}

//

core.callInLoop( function updatePhysics( delta ) {

	world.step( delta );

	objectsToUpdate.forEach( (mesh) => {

		// Copy coordinates from cannon.js to three.js
		mesh.position.copy( mesh.body.position );
		mesh.quaternion.copy( mesh.body.quaternion );

	});

})

//

export default {
	makePhysicalBox,
	makePhysicalSphere
}