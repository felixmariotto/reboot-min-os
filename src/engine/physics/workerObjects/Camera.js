
// physical representation of the camera in the physical world

import * as THREE from 'three';
import constants from '../../misc/constants.js';
import params from '../../params.js';
import Body from './Body.js';
import Sphere from './Sphere.js';

//

const _vec = new THREE.Vector3();
const targetVec = new THREE.Vector3();
let penetrationVec;

//

export default function Camera() {

	const camera = Object.assign(
		Body(),
		{
			isCamera: true,
			update
		}
	);

	camera.add( Sphere( params.cameraColliderRadius ) );

	//

	return camera

}

//

function update( world, cameraTargetPos ) {

	const colliders = world.children.filter( (child) => {

		return (
			child.bodyType !== constants.DYNAMIC_BODY &&
			!child.isCamera &&
			!child.isChainLink &&
			!child.isChainPoint
		)

	} );

	// we check for collision every fixed distance step along the way
	// between the camera position and its target position.

	const totalDist = this.position.distanceTo( cameraTargetPos );
	const steps = Math.ceil( totalDist / params.camStepDistance ) || 1;

	for ( let i = 0 ; i < steps + 1 ; i++ ) {

		_vec.lerpVectors(
			this.position,
			cameraTargetPos,
			i / steps
		);

		this.updateMatrixWorld();

		let mustBreak;

		this.children.forEach( (shape) => {

			colliders.forEach( (collider) => {

				collider.children.forEach( (colliderShape) => {

					penetrationVec = shape.penetrationIn( colliderShape, targetVec );

					if ( penetrationVec ) {

						_vec.addScaledVector( penetrationVec, -1.05 );

						mustBreak = true;

					}

				} );

			} );

		} );

		if ( mustBreak ) break

	}

	//

	this.position.copy( _vec );

	cameraTargetPos.x = this.position.x;
	cameraTargetPos.y = this.position.y;
	cameraTargetPos.z = this.position.z;

}