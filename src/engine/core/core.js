
import * as THREE from 'three';
import * as CANNON from 'cannon-es'
import params from '../params.js';

// THREE.js

let delta;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.style.height = '100vh';
renderer.domElement.style.width = '100vw';

const camera = new THREE.PerspectiveCamera(
	params.cameraFOV,
	1,
	params.cameraNear,
	params.cameraFar
);

const clock = new THREE.Clock();
const deltaClock = new THREE.Clock();

const loopCallbacks = [];

// CANNON.js

const world = new CANNON.World()

// Tweak contact properties.
// Contact stiffness - use to make softer/harder contacts
world.defaultContactMaterial.contactEquationStiffness = 1e9

// Stabilization time in number of timesteps
world.defaultContactMaterial.contactEquationRelaxation = 4

const solver = new CANNON.GSSolver()
solver.iterations = 7
solver.tolerance = 0.1
world.solver = new CANNON.SplitSolver(solver)
// use this to test non-split solver
// world.solver = solver

world.gravity.set(0, -20, 0)

// Create a slippery material (friction coefficient = 0.0)
const physicsMaterial = new CANNON.Material('physics')

const physics_physics = new CANNON.ContactMaterial( physicsMaterial, physicsMaterial, {
	friction: 0.0,
	restitution: 0.3,
});

// We must add the contact materials to the world
world.addContactMaterial( physics_physics );

//

window.addEventListener( 'resize', resize );

//

function init() {

	document.body.innerHTML = '';

	document.body.append( renderer.domElement );

	resize();

	clock.start();

	loop();

}

//

function resize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function loop() {

	delta = deltaClock.getDelta();

	requestAnimationFrame( loop );

	loopCallbacks.forEach( callback => callback( delta ) );

	renderer.render( scene, camera );

}

//

function callInLoop( fn ) {

	loopCallbacks.push( fn );

}

//

export default {
	init,
	scene,
	camera,
	renderer,
	clock,
	callInLoop
}
