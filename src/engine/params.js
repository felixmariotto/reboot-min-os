
import * as THREE from 'three';

//

export default {

	cameraFOV: 70,
	cameraNear: 0.05,
	cameraFar: 200,
	// thirdPersCameraTarget: new THREE.Vector3( 0, 5, 6 )
	thirdPersCameraTarget: new THREE.Vector3( 0, 15, 15 ),

	helpersMaterial: new THREE.MeshNormalMaterial(),
	cpHelpersMaterial: new THREE.MeshNormalMaterial({ wireframe: true }),

	physicsSimTicks: 4,
	gravity: new THREE.Vector3( 0, -0.035, 0 ),
	// [ 0 - 1 ] : power of the tendency to increase friction when colliding a horizontal plane.
	dampingAnglePower: 0.04,
	frictionResultToStop: Math.pow( 0.0017, 2 ), // resulting velocity length after friction to stop motion.

	bodyDefaultBounciness: 0,
	bodyDefaultDamping: 0.05,

	chainPasses: 7, // number of times the chain links are simulated per physics tick
	chainPointDistance: 0.9,
	chainSphereRadius: 0.4,
	chainWeight: 0.3,
	chainMass: 0.03,
	chainWeightOnPlayer: 0.04, // [ 0 - 1 ] value

	playerJumpSpeed: 0.3,
	playerAcceleration: 0.07,
	playerMaxAcceleration: 0.3, // speed at which the player can't accelerate manually
	notOnGroundHandicap: 0.5, // how much the player speed is reduced if not touching the ground ( but still colliding )
	notCollidingHandicap: 0.2,
	playerWeight: 0.3,
	playerMass: 1

}

