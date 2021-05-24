
import * as THREE from 'three';
import constants from '../../misc/constants.js';
import params from '../../params.js';

//

const targetVec = new THREE.Vector3();
const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();
const _vec1 = new THREE.Vector3();

const groundTestVec = new THREE.Vector3( 0, 1, 0 );

const NOMINAL_TICK_TIME = ( 1 / 60 ) / params.physicsSimTicks;

let penetrationVec;

//

export default function Body( bodyType=constants.STATIC_BODY, weight=1, mass=1 ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isBody: true,
			name: Math.random().toString(36).substring(8),
			bodyType,
			weight,
			mass,
			bounciness: params.bodyDefaultBounciness,
			damping: params.bodyDefaultDamping,
			updateTransform, 
			// velocity is in length-unit/graphic-frame
			// used only if bodyType is DYNAMIC_BODY
			velocity: new THREE.Vector3(),
			collideWith,
			resolvePenetration,
			// used to know how to control the player
			isOnGround: false,
			isColliding: false,
			clear,
			collideIn,
			constrain,
			updatePosFromArr,
			updateVelFromArr,
			handleCollection
		}
	)

}

// COLLISION DETECTION WITH FIXED BODIES
// Called by world.updatePhysics.
// shape.findNeighborsIn asks world.spatialIndex for the neighbors
// of each particular shape of this body.
// Then we perform a more fine-grain collision detection on the neighbors.

function collideIn( world, speedRatio ) {

	this.children.forEach( (shape) => {

		const neighbors = shape.findNeighborsIn( world );

		neighbors.forEach( (neighborShape) => {

			penetrationVec = shape.penetrationIn( neighborShape, targetVec );

			if ( penetrationVec ) {

				const collider = neighborShape.parent;

				// Collision resolution on this body position and velocity.
				// If the collider has the "empty" tag, we skip this.

				if ( !( collider.tags && collider.tags.empty ) ) {

					this.isColliding = true;

					// set isOnGround to true is the dynamic body is standing upon the kinematic collider

					if (
						this.isPlayer &&
						penetrationVec.dot( groundTestVec ) < 0
					) {
						this.isOnGround = true
					}

					//

					this.resolvePenetration( penetrationVec, collider.damping, speedRatio );

				}

				// if the collider has the "blocking" tag,
				// we stop this body motion altogether

				if ( collider.tags && collider.tags.blocking ) {

					this.velocity.setScalar( 0 );

					this.isBlocked = true;

				}

				// trigger event on item collection

				this.handleCollection( collider );

			}

		} );

	} );

}

// COLLISION DETECTION WITH KINEMATIC AND DYNAMIC BODIES.
// As kinematic and dynamic bodies don't have a fixed position,
// they can't be sorted out in world.spatialIndex,
// so dynamic bodies must perform collision
// detection with every kinematic body at each frame.

const mirrorCollision = new THREE.Vector3();

function collideWith( collider, speedRatio ) {

	this.children.forEach( (shape) => {

		collider.children.forEach( (colliderShape) => {

			penetrationVec = shape.penetrationIn( colliderShape, targetVec );

			if ( penetrationVec ) {

				// Collision resolution on this body position and velocity.
				// If the collider has the "empty" tag, we skip this.

				if ( !( collider.tags && collider.tags.empty ) ) {

					this.isColliding = true;

					// set isOnGround to true is the dynamic body is standing upon the kinematic collider

					if (
						this.isPlayer &&
						penetrationVec.dot( groundTestVec ) < 0
					) {
						this.isOnGround = true
					}

					// get dynamic body and collider out of collision + compute new velocities

					if ( collider.bodyType === constants.DYNAMIC_BODY ) {

						// power of each body on the opposite body, depends on each body mass.
						const thisPower = this.mass / ( this.mass + collider.mass );
						const colliderPower = collider.mass / ( collider.mass + this.mass );

						// compute first the collider displacement

						mirrorCollision
						.copy( penetrationVec )
						.multiplyScalar( thisPower )
						.negate();

						penetrationVec.multiplyScalar( colliderPower );

						collider.position.sub( mirrorCollision );
						collider.velocity.sub( mirrorCollision );

						// correct the displacement vector to apply on this body,
						// acording to the collider constraints.

						if ( collider.tags && collider.tags.range ) {

							const diff = _vec0.copy( collider.position );

							collider.constrain();

							diff.sub( collider.position );

							penetrationVec.add( diff );

						}

						this.resolvePenetration( penetrationVec, collider.damping, speedRatio );

					// the collider is a kinematic body, so we need to compute the collider velocity

					} else {

						// compute transforms of the kinematic body in the next tick

						this.position.addScaledVector( this.velocity, 1 / params.physicsSimTicks );

						collider.updateTransform( collider.lastTransformTime + ( NOMINAL_TICK_TIME * 1000 ) );
						collider.updateMatrixWorld();

						// compute the penetration vector with the kinematic body more forward in time

						const penetrationVec2 = shape.penetrationIn( colliderShape, _vec0 );

						// add velocity resulting from collision to the dynamic body velocity

						if ( penetrationVec2 ) {

							// velocity of the kinematic body

							penetrationVec2
							.sub( penetrationVec )
							.multiplyScalar( params.physicsSimTicks );

							// difference with this body velocity

							penetrationVec2.sub( this.velocity );

							// constrain this body velocity to collider velocity

							penetrationVec2.x = Math.sign( penetrationVec2.x ) !== Math.sign( this.velocity.x ) ? 0 : penetrationVec2.x;
							penetrationVec2.y = Math.sign( penetrationVec2.y ) !== Math.sign( this.velocity.y ) ? 0 : penetrationVec2.y;
							penetrationVec2.z = Math.sign( penetrationVec2.z ) !== Math.sign( this.velocity.z ) ? 0 : penetrationVec2.z;

							this.velocity.sub( penetrationVec2 );

						}

						// reset both bodies transforms

						collider.updateTransform( collider.lastTransformTime );
						collider.updateMatrixWorld();

						this.position.addScaledVector( this.velocity, ( 1 / params.physicsSimTicks ) * -1 );

						this.resolvePenetration( penetrationVec, collider.damping, speedRatio );

					}

				}

				// if the collider has the "blocking" tag,
				// we stop this body motion altogether

				if ( collider.tags && collider.tags.blocking ) {

					this.velocity.setScalar( 0 );

					this.isBlocked = true;

				}

				// trigger event on item collection

				this.handleCollection( collider );

			}

		} );

	} );

}

//

function handleCollection( collider ) {

	if ( collider.tags && collider.tags.collectible ) {

		if ( !collider.tags.isCollected ) {

			collider.tags.isCollected = true;

			emitEvent( 'item-collected', {
				serial: collider.serial,
				name: collider.name,
				collectible: collider.tags.collectible
			} );

		}

	}

}

//

function resolvePenetration( penetrationVec, colliderDamping, speedRatio ) {

	speedRatio /= params.physicsSimTicks;

	// move out of collision

	this.position.sub( penetrationVec );

	// bounce

	// no bounce if the dynamic object is already going away from the collision
	if ( penetrationVec.dot( this.velocity ) < 0 ) return

	penetrationVec.normalize();

	const bounceDampVec = _vec
	.copy( this.velocity )
	.projectOnVector( penetrationVec )

	// bounce velocity against collider normal
	this.velocity.reflect( penetrationVec );

	// slow down velocity in the direction of the obstacle normal
	this.velocity.addScaledVector( bounceDampVec, 1 - this.bounciness );

	// compute how much the resulting velocity will be askew from the ground plane
	const skewFromGround = Math.max( 0, penetrationVec.dot( groundTestVec ) );
	const factor = params.dampingAnglePower * ( 1 - Math.abs( Math.pow( skewFromGround, 50 ) ) ) * speedRatio;

	// slow down velocity, to mimic friction
	this.velocity.multiplyScalar( 1 - factor - ( colliderDamping * speedRatio ) );

	// if the resulting velocity is bellow a certain threshold, we set it to 0.
	if (
		this.isPlayer &&
		this.velocity.lengthSq() < params.frictionResultToStop
	) {
		this.velocity.setScalar( 0 );
	}

}

//

function constrain() {

	if ( this.tags && this.tags.range ) {

		_vec1.copy( this.position );

		this.position.max( this.tags.range[0] );
		this.position.min( this.tags.range[1] );

		if ( this.position.x !== _vec1.x ) this.velocity.x = 0;
		if ( this.position.y !== _vec1.y ) this.velocity.y = 0;
		if ( this.position.z !== _vec1.z ) this.velocity.z = 0;

	}

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

function updatePosFromArr( typedArr ) {

	this.position.set(
		typedArr[ ( this.serial * 3 ) + 0 ],
		typedArr[ ( this.serial * 3 ) + 1 ],
		typedArr[ ( this.serial * 3 ) + 2 ]
	);

}

function updateVelFromArr( typedArr ) {

	this.velocity.set(
		typedArr[ ( this.serial * 3 ) + 0 ],
		typedArr[ ( this.serial * 3 ) + 1 ],
		typedArr[ ( this.serial * 3 ) + 2 ]
	);

}

function updateTransform( time ) {

	if ( this.transformFunction ) {

		this.transformFunction( time );

	}
	
}
