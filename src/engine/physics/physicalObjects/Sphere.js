
import * as THREE from 'three';

//

export default function Sphere( radius=1 ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			radius
		}
	)

}