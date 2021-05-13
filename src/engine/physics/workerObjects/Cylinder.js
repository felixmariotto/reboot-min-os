
import * as THREE from 'three';
import params from '../../params.js';
import Shape from './Shape.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

//

export default function Cylinder( radius=1, height=1 ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		Shape(),
		{
			radius,
			height,
			isCylinder: true
		}
	)

}
