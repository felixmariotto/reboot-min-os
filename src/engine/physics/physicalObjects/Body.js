
import * as THREE from 'three';

//

export default function Body( isDynamic, mass ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isBody: true,
			isDynamic,
			mass
		}
	)

}