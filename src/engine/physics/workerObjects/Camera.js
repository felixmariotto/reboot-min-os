
// physical representation of the camera in the physical world

import * as THREE from 'three';
import constants from '../../misc/constants.js';
import params from '../../params.js';
import Body from './Body.js';
import Sphere from './Sphere.js';

//

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

	this.position.copy( cameraTargetPos );

	this.updateMatrixWorld();

	const colliders = world.children.filter( (child) => {

		return (
			child.bodyType !== constants.DYNAMIC_BODY &&
			!child.isCamera &&
			!child.isChainLink &&
			!child.isChainPoint
		)

	} );

	this.children.forEach( (shape) => {

		colliders.forEach( (collider) => {

			collider.children.forEach( (colliderShape) => {

				penetrationVec = shape.penetrationIn( colliderShape, targetVec );

				if ( penetrationVec ) {

					this.position.sub( penetrationVec );

				}

			} );

		} );

	} );

	cameraTargetPos.x = this.position.x;
	cameraTargetPos.y = this.position.y;
	cameraTargetPos.z = this.position.z;

}