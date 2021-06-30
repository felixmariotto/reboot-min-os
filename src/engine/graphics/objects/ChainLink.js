
import * as THREE from 'three';
import params from '../../params.js';
import materials from '../materials.js';

//

export default function ChainLink() {

	return new THREE.Mesh(
		new THREE.IcosahedronGeometry( params.chainSphereRadius, 1 ),
		materials.chainMaterial
	)

}
