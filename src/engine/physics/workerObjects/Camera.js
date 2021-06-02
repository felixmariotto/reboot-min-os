
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
			update,
			lastPosition: new THREE.Vector3()
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

	//

	for ( let i=0 ; i<params.cameraCollisionPasses ; i++ ) {

		this.position.lerpVectors(
			this.lastPosition,
			cameraTargetPos,
			i / ( params.cameraCollisionPasses - 1 )
		);

		this.updateMatrixWorld();

		let mustBreak;

		this.children.forEach( (shape) => {

			colliders.forEach( (collider) => {

				collider.children.forEach( (colliderShape) => {

					penetrationVec = shape.penetrationIn( colliderShape, targetVec );

					if ( penetrationVec ) {

						this.position.sub( penetrationVec );

						mustBreak = true;

					}

				} );

			} );

		} );

		if ( mustBreak ) break

	}

	//

	this.lastPosition.copy( this.position );

	cameraTargetPos.x = this.position.x;
	cameraTargetPos.y = this.position.y;
	cameraTargetPos.z = this.position.z;

}