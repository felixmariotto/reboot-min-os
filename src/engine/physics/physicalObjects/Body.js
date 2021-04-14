
import * as THREE from 'three';

//

const tragetVec = new THREE.Vector3();
const _vec = new THREE.Vector3();

//

export default function Body( isDynamic, mass=1 ) {

	function collideWith( collider ) {

		this.children.forEach( (shape) => {

			collider.children.forEach( (colliderShape) => {

				const penetrationVec = shape.penetrationIn( colliderShape, tragetVec );

				if ( penetrationVec ) {

					this.position.sub( penetrationVec );

					penetrationVec.normalize();

					const bounceDampVec = _vec
					.copy( this.velocity )
					.projectOnVector( penetrationVec )
					.negate();

					this.velocity.addScaledVector( bounceDampVec, 1 - this.bounciness );

					this.velocity.reflect( penetrationVec );

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
			bounciness: 0.5,
			velocity: new THREE.Vector3(), // used only if isDynamic == true
			collideWith
		}
	)

}