
import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';

import threeCore from '../core/threeCore.js';

// Add the raycast function. Assumes the BVH is available on
// the `boundsTree` variable
THREE.Mesh.prototype.raycast = acceleratedRaycast;

//

let environmentGeom;

//

function setEnvironmentGeom( geometry ) {

	environmentGeom = geometry.clone();

	environmentGeom.boundsTree = new MeshBVH( environmentGeom );

	/*
	const collider = new THREE.Mesh( environmentGeom, new THREE.MeshBasicMaterial() );
	collider.material.wireframe = true;
	threeCore.scene.add( collider );
	*/

}

//

export default {
	setEnvironmentGeom
}
