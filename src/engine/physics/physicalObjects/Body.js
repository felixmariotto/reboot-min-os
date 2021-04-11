
import * as THREE from 'three';

//

const _vec = new THREE.Vector3();

const collisionVectors = [];

for ( let i=0 ; i<16 ; i++ ) {

	collisionVectors.push( new THREE.Vector3() );

}

//

export default function Body( mass=0.5 /* between 0 and 1 */ ) {

	function addShape() {

		this.add( ...arguments );

		this.computeBB();

	}

	// compute bounding box of the shapes

	function computeBB() {

		this.children.forEach( child => child.expandBB() );

	}

	//

	function initHelper( scene ) {

		scene.add( this );

		this.children.forEach( (shape) => {

			shape.makeHelper();

		} );

	}

	//

	function collideWith( colliderBody ) {

		const collisions = [];

		this.children.forEach( (shape) => {

			colliderBody.children.forEach( (colliderShape) => {

				const vec = collisionVectors[ collisions.length ];

				const collisionPoint = shape.collideWith( colliderShape, vec );

				if ( collisionPoint ) {

					collisions.push( collisionPoint )

				}

			} );

		} );

		// resolve velocity and rotation according to collisions

		if ( collisions.length !== 0 ) {

			console.log( 'collisions', collisions );

			console.log( 'this.boundingBox', this.boundingBox );

			debugger

		}

	}

	//

	return Object.assign(
		Object.create( new THREE.Object3D ),
		{
			velocity: new THREE.Vector3(),
			boundingBox: new THREE.Box3(),
			mass,
			addShape,
			initHelper,
			collideWith,
			computeBB
		}
	);

}