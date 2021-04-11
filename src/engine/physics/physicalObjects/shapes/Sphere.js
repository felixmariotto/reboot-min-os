
import * as THREE from 'three';
import params from '../../../params.js';

//

export default function Sphere( radius=0.5 ) {

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry( this.radius, 4 ),
			params.helpersMaterial
		);

		this.add( mesh );

		return mesh

	}

	//

	function collideWith( colliderShape, targetVec ) {

		return null;

	}

	//

	return Object.assign(
		Object.create( new THREE.Object3D ),
		{
			radius,
			type: 'sphere',
			makeHelper,
			collideWith
		}
	);

}