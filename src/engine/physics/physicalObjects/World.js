
import * as THREE from 'three';

//

export default function World() {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isWorld: true
		}
	)

}