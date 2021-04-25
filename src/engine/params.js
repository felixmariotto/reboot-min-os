
import * as THREE from 'three';

//

export default {

	cameraFOV: 70,
	cameraNear: 0.05,
	cameraFar: 200,
	// thirdPersCameraTarget: new THREE.Vector3( 0, 5, 6 )
	thirdPersCameraTarget: new THREE.Vector3( 0, 15, 15 ),

	helpersMaterial: new THREE.MeshNormalMaterial(),
	physicsSimTicks: 15,
	chainPasses: 5, // number of times the chain links are simulated per physics tick
	gravity: new THREE.Vector3( 0, -0.035, 0 ),
	chainPointDistance: 0.9,
	chainSphereRadius: 0.4,
	chainWeight: 0.10, // [ 0 - 1 ] value

	playerSpeed: 0.03,
	notOnGroundHandicap: 0.5, // how much the player speed is reduced if not touching the ground ( but still colliding )
	playerWeight: 0.3
}

