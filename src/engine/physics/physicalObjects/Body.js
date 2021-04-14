
import * as THREE from 'three';

//

const tragetVec = new THREE.Vector3();

//

export default function Body( isDynamic, mass=1 ) {

	function collideWith( collider ) {

		this.children.forEach( (shape) => {

			collider.children.forEach( (colliderShape) => {

				const penetrationVec = shape.penetrationIn( colliderShape, tragetVec );

				if ( penetrationVec ) {

					this.position.sub( penetrationVec );

					// this.velocity.set( 0, 0.22, 0 );

					penetrationVec.normalize();
					this.velocity.reflect( penetrationVec );

					// this.velocity.multiplyScalar( 1 );

				}

			} );

		} );

	}

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isBody: true,
			isDynamic,
			mass,
			velocity: new THREE.Vector3(), // used only if isDynamic == true
			collideWith
		}
	)

}