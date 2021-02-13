
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import core from '../core/core.js';

// article on chain physics :
// https://stackoverflow.com/questions/42609279/how-to-simulate-chain-physics-game-design/42618200

const world = new CANNON.World();

world.gravity.set(0, -20, 0)

const helperMaterial = new THREE.MeshNormalMaterial({
	// wireframe: true
});

const physicsMaterial = new CANNON.Material('physics');

const physics_physics = new CANNON.ContactMaterial( physicsMaterial, physicsMaterial, {
	friction: 0.1,
	restitution: 0.3
});

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

function makePhysicalHullCompo( options ) {

	const toMerge = [];

	// CANNON

	const hullBody = new CANNON.Body({
		mass: options.mass,
		material: physicsMaterial
	});

	options.sourceObject.traverse( (obj) => {

		if ( obj.geometry ) {

			toMerge.push( obj.geometry );

			const posAttrib = obj.geometry.attributes.position;
			const vertices = [];

			for ( let i=0 ; i<posAttrib.count ; i++ ) {

				vertices.push(
					new CANNON.Vec3(
						posAttrib.getX( i ),
						posAttrib.getY( i ),
						posAttrib.getZ( i )
					)
				);

			}

			//

			const normAttrib = obj.geometry.attributes.normal;
			const normals = [];

			for ( let i=0 ; i<normAttrib.count ; i++ ) {

				normals.push(
					new CANNON.Vec3(
						normAttrib.getX( i ),
						normAttrib.getY( i ),
						normAttrib.getZ( i )
					)
				);

			}

			//

			const index = obj.geometry.index;
			const faces = [];

			for ( let i=0 ; i<index.count ; i+=3 ) {

				faces.push([
					index.array[ i ],
					index.array[ i + 1 ],
					index.array[ i + 2 ]
				]);

			}

			// Construct polyhedron

			const hullPart = new CANNON.ConvexPolyhedron({ vertices, faces, normals })

			// Add to compound

			hullBody.addShape( hullPart );

		}

	});

	world.addBody( hullBody );

	// THREE

	const geometry = BufferGeometryUtils.mergeBufferGeometries( toMerge );

	const mesh = new THREE.Mesh( geometry, helperMaterial );

	core.scene.add( mesh );

	//

	mesh.body = hullBody;

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

const TICKS_PER_FRAME = 7;

core.callInLoop( function updatePhysics( delta ) {

	for ( let i=0 ; i<TICKS_PER_FRAME ; i++) {

		world.step( delta / TICKS_PER_FRAME );

		objectsToUpdate.forEach( (mesh) => {

			// Copy coordinates from cannon.js to three.js
			mesh.position.copy( mesh.body.position );
			mesh.quaternion.copy( mesh.body.quaternion );

		});

	}

})

//

export default {
	makePhysicalBox,
	makePhysicalSphere,
	makePhysicalHullCompo
}