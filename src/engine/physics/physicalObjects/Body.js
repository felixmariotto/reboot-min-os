
import * as THREE from 'three';
import constants from '../../misc/constants.js';
import params from '../../params.js';

//

const tragetVec = new THREE.Vector3();
const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

const NOMINAL_TICK_TIME = ( 1 / 60 ) / params.physicsSimTicks;

//

export default function Body( bodyType=constants.STATIC_BODY, mass=1 ) {

	function collideWith( collider ) {

		this.children.forEach( (shape) => {

			collider.children.forEach( (colliderShape) => {

				const penetrationVec = shape.penetrationIn( colliderShape, tragetVec );

				if ( penetrationVec ) {

					if ( collider.bodyType === constants.KINEMATIC_BODY ) {

						// compute transforms of the kinematic body in the next tick

						const beforeTransform = collider.position;

						collider.updateTransform( collider.lastTransformTime + ( NOMINAL_TICK_TIME * 1000 ) );
						collider.updateMatrixWorld();

						const afterTransform = collider.position;

						// compute the penetration vector with the kinematic body more forward in time

						const penetrationVec2 = shape.penetrationIn( colliderShape, _vec0 );

						// add velocity resulting from collision to the dynamic body velocity

						if ( penetrationVec2 ) {

							penetrationVec2
							.sub( penetrationVec )
							.multiplyScalar( params.physicsSimTicks );

							this.resolvePenetration( penetrationVec );

							this.velocity.add( penetrationVec2 );

						} else {

							this.resolvePenetration( penetrationVec );

						}

						// reset kinematic body transforms

						collider.updateTransform( collider.lastTransformTime );
						collider.updateMatrixWorld();

					} else {

						this.resolvePenetration( penetrationVec );

					}

				}

			} );

		} );

	}

	//

	function resolvePenetration( penetrationVec ) {

		this.position.sub( penetrationVec );

		// no bounce if the dynamic object is already going away from the collision
		if ( penetrationVec.dot( this.velocity ) < 0 ) return

		penetrationVec.normalize();

		const bounceDampVec = _vec
		.copy( this.velocity )
		.projectOnVector( penetrationVec )
		.negate();

		this.velocity.addScaledVector( bounceDampVec, 1 - this.bounciness );

		this.velocity.reflect( penetrationVec );

	}

	//

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isBody: true,
			bodyType,
			mass,
			bounciness: 0.5,
			velocity: new THREE.Vector3(), // used only if bodyType is DYNAMIC_BODY
			collideWith,
			resolvePenetration
		}
	)

}