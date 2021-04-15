
import * as THREE from 'three';
import core from '../../core/core.js';
import params from '../../params.js';
import constants from '../../misc/constants.js';

//

export default function World() {

	const world = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isWorld: true,
			enabled: true
		}
	);

	//

	core.callInLoop( ( delta ) => {

		update.call( world, delta );

	} );

	function update( delta ) {

		if ( this.enabled ) {

			for ( let i=0 ; i<params.physicsSimTicks ; i++ ) {

				updatePhysics.call( world, delta / params.physicsSimTicks );

			}

		}

	}

	function updatePhysics( delta ) {

		// call every kinematic body transformation callback

		this.children.forEach( (body) => {

			if (
				body.bodyType === constants.KINEMATIC_BODY &&
				body.updateTransform
			) {
				body.updateTransform();
			}

		} );

		//

		this.children.forEach( body => body.updateMatrixWorld() );

		//

		this.children.forEach( (body) => {

			if ( !body.isBody ) console.warn( 'an object that is not a body was added to the world' )

			if ( body.bodyType === constants.DYNAMIC_BODY ) {

				// add gravity to velocity

				body.velocity.addScaledVector( params.gravity, delta * body.mass );

				// update position according to velocity

				body.position.add( body.velocity );

				body.updateMatrixWorld();

				// collide with non-dynamic bodies

				this.children.forEach( (collider) => {

					if ( collider.bodyType !== constants.DYNAMIC_BODY ) body.collideWith( collider );

				} );

			}

		} );

	}

	//

	return world

}