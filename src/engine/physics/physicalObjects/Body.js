
import * as THREE from 'three';

//

const _vec = new THREE.Vector3();

//

export default function Body( mass=0.5 /* between 0 and 1 */ ) {

	function addShape() {

		this.shapes.push( ...arguments );

	}

	function initHelper( scene ) {

		this.helper = new THREE.Group();

		scene.add( this.helper );

		this.shapes.forEach( (shape) => {

			shape.makeHelper();

			this.helper.add( shape );

		} );

	}

	function collideWith( colliderBody ) {

		this.shapes.forEach( (shape) => {

			colliderBody.shapes.forEach( (colliderShape) => {

				const collisionPoint = shape.collideWith( colliderShape, _vec );

			} );

		} );

		// console.log( colliderBody );

		// debugger

	}

	return Object.assign(
		Object.create( new THREE.Object3D ),
		{
			velocity: new THREE.Vector3(),
			mass,
			shapes: [],
			addShape,
			initHelper,
			collideWith
		}
	);

}