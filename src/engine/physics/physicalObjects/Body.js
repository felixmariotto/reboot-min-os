
import * as THREE from 'three';

//

export default function Body( isDynamic, mass=1 ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isBody: true,
			isDynamic,
			mass,
			velocity: new THREE.Vector3() // used only if isDynamic == true
		}
	)

}