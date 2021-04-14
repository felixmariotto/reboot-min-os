
import * as THREE from 'three';
import params from '../../params.js';

//

export default function Sphere( radius=1 ) {

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry( this.radius, 4 ),
			params.helpersMaterial
		)

		this.add( mesh );

	}

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			radius,
			makeHelper
		}
	)

}