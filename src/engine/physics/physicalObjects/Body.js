
import * as THREE from 'three';

//

const _vec = new THREE.Vector3();

//

export default function Body( mass=0.5 /* between 0 and 1 */ ) {

	function addShape() {

		this.add( ...arguments );

	}

	function initHelper( scene ) {

		scene.add( this );

		this.children.forEach( (shape) => {

			shape.makeHelper();

		} );

	}

	function collideWith( colliderBody ) {

		this.children.forEach( (shape) => {

			colliderBody.children.forEach( (colliderShape) => {

				const collisionPoint = shape.collideWith( colliderShape, _vec );

				if ( collisionPoint ) {

					console.log( collisionPoint );

					debugger

				}

			} );

		} );

	}

	return Object.assign(
		Object.create( new THREE.Object3D ),
		{
			velocity: new THREE.Vector3(),
			mass,
			addShape,
			initHelper,
			collideWith
		}
	);

}