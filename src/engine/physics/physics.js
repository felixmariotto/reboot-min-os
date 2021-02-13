
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import core from '../core/core.js';

// article on chain physics :
// https://stackoverflow.com/questions/42609279/how-to-simulate-chain-physics-game-design/42618200

const world = new CANNON.World();
let body, mesh;

function makePhysicalBox( width, height, depth ) {

	// Box
	const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
	body = new CANNON.Body({
		mass: 1,
	})
	body.addShape(shape)
	body.angularVelocity.set(0, 10, 0)
	body.angularDamping = 0.5
	world.addBody(body);

	// three

	const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })

	mesh = new THREE.Mesh(geometry, material)
	core.scene.add(mesh)

	return mesh

}

//

core.callInLoop( function updatePhysics( delta ) {

	if ( body && mesh ) {

		world.step( delta );

		// Copy coordinates from cannon.js to three.js
		mesh.position.copy(body.position)
		mesh.quaternion.copy(body.quaternion)
		
	}

})

//

export default {
	makePhysicalBox
}