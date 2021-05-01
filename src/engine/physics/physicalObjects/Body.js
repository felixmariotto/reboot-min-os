
import * as THREE from 'three';
import constants from '../../misc/constants.js';
import params from '../../params.js';

//

const tragetVec = new THREE.Vector3();
const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

const groundTestVec = new THREE.Vector3( 0, 1, 0 );

const NOMINAL_TICK_TIME = ( 1 / 60 ) / params.physicsSimTicks;

//

export default function Body( bodyType=constants.STATIC_BODY, mass=1 ) {

	function collideWith( collider ) {

		this.children.forEach( (shape) => {

			collider.children.forEach( (colliderShape) => {

				const penetrationVec = shape.penetrationIn( colliderShape, tragetVec );

				if ( penetrationVec ) {

					this.isColliding = true;

					// set isOnGround to true is the dynamic body is standing upon the kinematic collider

					if (
						this.bodyType === constants.DYNAMIC_BODY &&
						penetrationVec.dot( groundTestVec ) < 0
					) {
						this.isOnGround = true
					}

					if ( collider.bodyType === constants.KINEMATIC_BODY ) {

						// compute transforms of the kinematic body in the next tick

						this.position.addScaledVector( this.velocity, 1 / params.physicsSimTicks );

						collider.updateTransform( collider.lastTransformTime + ( NOMINAL_TICK_TIME * 1000 ) );
						collider.updateMatrixWorld();

						// compute the penetration vector with the kinematic body more forward in time

						const penetrationVec2 = shape.penetrationIn( colliderShape, _vec0 );

						// add velocity resulting from collision to the dynamic body velocity

						if ( penetrationVec2 ) {

							penetrationVec2
							.sub( penetrationVec )
							.multiplyScalar( params.physicsSimTicks );

							if ( penetrationVec2.dot( penetrationVec ) > 0 ) {

								penetrationVec2.multiplyScalar( 0.2 );
								penetrationVec2.negate();

							}

							this.velocity.add( penetrationVec2 );

							this.resolvePenetration( penetrationVec, collider.damping );

							

						} else {

							this.resolvePenetration( penetrationVec, collider.damping );

						}

						// reset body transforms

						collider.updateTransform( collider.lastTransformTime );
						collider.updateMatrixWorld();

						this.position.addScaledVector( this.velocity, ( 1 / params.physicsSimTicks ) * -1 );

					} else {

						this.resolvePenetration( penetrationVec, collider.damping );

						if ( this.isPlayer ) {

							/*
							if ( penetrationVec.length() > 0.1 ) {

								console.log( 'penetrationVec', penetrationVec )
								console.log( 'gregre' )
								debugger

							}
							*/
					
							/*
							if ( this.velocity.length() > 1 ) {

								console.log( 'penetrationVec', penetrationVec )
								console.log( 'this.velocity', this.velocity )
								debugger

							}
							*/

						}

					}

				}

			} );

		} );

	}

	//

	function resolvePenetration( penetrationVec, colliderDamping ) {

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

		this.velocity.multiplyScalar( 1 - colliderDamping );

	}

	//

	function clear() {

		this.traverse( (child) => {

			if ( child.geometry ) child.geometry.dispose();
			if ( child.material ) child.material.dispose();

		} );

		this.parent.remove( this );

	}

	//

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isBody: true,
			name: Math.random().toString(36).substring(8),
			bodyType,
			mass,
			bounciness: 0,
			damping: 0.007,
			// transformation code that define pos and rot from a timestamp
			transformCode: null,
			updateTransform: function () {
				if ( this.transformCode ) {
					eval( this.transformCode );
				}
			}, 
			// velocity is in length-unit/graphic-frame
			// used only if bodyType is DYNAMIC_BODY
			velocity: new THREE.Vector3(),
			collideWith,
			resolvePenetration,
			// used to know how to control the player
			isOnGround: false,
			isColliding: false,
			clear
		}
	)

}
