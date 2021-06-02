
import * as THREE from 'three';

//

export default {

	// [ 0 - 1 ] tweening of the entities position to smooth the jittering
	// caused by worker <=> main thread message latency.
	positionSmoothing: 0.5,

	cameraFOV: 80,
	cameraNear: 0.1,
	cameraFar: 200,
	thirdPersCameraTarget: new THREE.Vector3( 0, 10, 10 ),
	cameraEasing: 0.1,
	cameraColliderRadius: 1,
	cameraCollisionPasses: 6,

	helpersMaterial: new THREE.MeshNormalMaterial(),
	cpHelpersMaterial: new THREE.MeshNormalMaterial({ wireframe: true }),

	physicsSimTicks: 5,
	gravity: new THREE.Vector3( 0, -0.035, 0 ),
	// [ 0 - 1 ] : power of the tendency to increase friction when colliding a horizontal plane.
	dampingAnglePower: 0.04,
	frictionResultToStop: Math.pow( 0.0017, 2 ), // resulting velocity length after friction to stop motion.

	bodyDefaultBounciness: 0,
	bodyDefaultDamping: 0.05,

	chainPasses: 5, // number of times the chain links are simulated per physics tick
	chainPointDistance: 0.9,
	chainSphereRadius: 0.4,
	chainWeight: 0.3,
	chainMass: 0.03,
	// How the chain pulls the player back.
	// A higher value keeps the chain from traversing obstacles if the player pulls on it.
	// A lower value make the player incontrollable in the air ( the chain pull is too strong ).
	chainWeightOnPlayer: 0.07, // [ 0 - 1 ] value

	playerJumpSpeed: 0.3,
	playerAcceleration: 0.08,
	playerMaxAcceleration: 0.28, // speed at which the player can't accelerate manually
	notOnGroundHandicap: 0.08, // how much the player speed is reduced if not touching the ground ( but still colliding )
	notCollidingHandicap: 0.03,
	playerWeight: 0.3,
	playerMass: 1

}

