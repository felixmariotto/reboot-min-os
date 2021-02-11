
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MeshBVH, MeshBVHVisualizer } from 'three-mesh-bvh';

import core from '../core/core.js';

//

const VISUALIZE_BVH = false;
const VISUALIZE_DEPTH = 10;

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

	geometry.boundsTree = new MeshBVH( geometry, { lazyGeneration: false } );

	const capsule = new THREE.Mesh( geometry );

	capsule.isPhysicalObject = true;
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

function makeMesh( geometry ) {

	geometry = geometry.clone();

	geometry.boundsTree = new MeshBVH( geometry, { lazyGeneration: false } );

	const mesh = new THREE.Mesh( geometry );

	mesh.isPhysicalObject = true;
	mesh.isPhysicalMesh = true;

	mesh.makeHelper = makeHelper;

	return mesh

}

//

function makeHelper( wireframe ) {

	this.material = new THREE.MeshNormalMaterial({
		wireframe,
		transparent: wireframe,
		opacity: 0.5
	});

	core.scene.add( this );

	if ( VISUALIZE_BVH ) {

		const visualizer = new MeshBVHVisualizer( this, VISUALIZE_DEPTH );

		core.scene.add( visualizer );

	}

}

//

export default {
	makeCapsule,
	makeMesh
}