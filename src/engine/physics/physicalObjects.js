
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import * as CANNON from 'cannon-es';

import core from '../core/core.js';

//

function makeCapsule( radius, height ) {

	const geometry = new RoundedBoxGeometry(
		radius * 2, // width
		height,
		radius * 2, // depth
		4, // segments
		radius
	)

	geometry.translate( 0, height * 0.5, 0 );

	const capsule = PhysicalMesh( geometry );

	capsule.isCapsule = true;

	capsule.makeHelper = makeHelper;

	capsule.capsuleInfo = {
		radius: radius,
		segment: new THREE.Line3(
			new THREE.Vector3(),
			new THREE.Vector3( 0, height, 0 )
		)
	};

	return capsule

}

//

function makeBox( width, height, depth ) {

	// CANNON object

	const shape = new CANNON.Box(
		new CANNON.Vec3( width * 0.5, height * 0.5, depth * 0.5 )
	);

	const body = new CANNON.Body({
		mass: 1
	});

	body.addShape( shape );

	// THREE object

	const geometry = new THREE.BoxBufferGeometry( width, height, depth );

	const mesh = new THREE.Mesh( geometry );

	mesh.makeHelper = makeHelper;

	mesh.body = body;

	//

	return mesh

}

//

function makeMesh( geometry ) {

	geometry = geometry.clone();

	const mesh = PhysicalMesh( geometry );

	mesh.isPhysicalMesh = true;

	mesh.makeHelper = makeHelper;

	return mesh

}

//

function PhysicalMesh( geometry ) {

	const mesh = new THREE.Mesh( geometry );

	mesh.isPhysicalObject = true;

	mesh.velocity = new THREE.Vector3();

	return mesh

}

//

function makeHelper( wireframe ) {

	this.material = new THREE.MeshNormalMaterial({
		wireframe: wireframe ? true : false,
		transparent: wireframe ? true : false,
		opacity: 0.5
	});

	core.scene.add( this );

}

//

export default {
	makeCapsule,
	makeBox,
	makeMesh
}