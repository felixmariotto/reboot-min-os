
import * as THREE from 'three';

//

const tragetVec = new THREE.Vector3();

//

export default function Body( isDynamic, mass=1 ) {

	function collideWith( collider ) {

		this.children.forEach( (shape) => {

			collider.children.forEach( (colliderShape) => {

				const penetrationVec = shape.penetrationIn( colliderShape, tragetVec );

				this.position.add( penetrationVec );

				this.velocity.add( penetrationVec );

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