
import * as THREE from 'three';
import params from '../../params.js';
import Shape from './Shape.js';

//

export default function Cylinder( radius=1, height=1 ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		Shape(),
		{
			radius,
			height,
			isCylinder: true,
			makeMesh
		}
	)

}

//

function makeMesh() {

	this.add( new THREE.Mesh(
		new THREE.CylinderGeometry( this.radius, this.radius, this.height, 12 ),
		params.helpersMaterial
	) );

}
