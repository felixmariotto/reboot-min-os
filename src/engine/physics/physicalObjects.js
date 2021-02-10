
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { MeshBVH } from 'three-mesh-bvh';

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

	geometry.boundsTree = new MeshBVH( geometry );

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

function makeHelper( wireframe ) {

	this.material = new THREE.MeshBasicMaterial({
		wireframe,
		transparent: true,
		opacity: 0.5
	});

	core.scene.add( this );

}

//

export default {
	makeCapsule
}