
import * as THREE from 'three';
import params from '../../../params.js';

//

export default function Sphere( radius=0.5 ) {

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry( this.radius, 4 ),
			params.helpersMaterial
		);

		mesh.position.copy( this.position );

		return mesh

	}

	return {
		radius,
		type: 'sphere',
		position: new THREE.Vector3(),
		makeHelper
	}

}