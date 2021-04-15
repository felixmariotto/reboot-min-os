
import * as THREE from 'three';

//

export default {
	cameraFOV: 50,
	cameraNear: 0.05,
	cameraFar: 200,
	// thirdPersCameraTarget: new THREE.Vector3( 0, 5, 6 )
	thirdPersCameraTarget: new THREE.Vector3( 0, 20, 9 ),
	helpersMaterial: new THREE.MeshNormalMaterial(),
	physicsSimTicks: 15,
	gravity: new THREE.Vector3( 0, -0.035, 0 )
}
