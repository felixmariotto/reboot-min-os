
import * as THREE from 'three';
import params from '../../params.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

//

export default function Cylinder( radius=1, height=1 ) {

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.CylinderGeometry( this.radius, this.radius, this.height, 12 ),
			params.helpersMaterial
		)

		this.add( mesh );

	}

	//

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			radius,
			height,
			isCylinder: true,
			makeHelper
		}
	)

}
