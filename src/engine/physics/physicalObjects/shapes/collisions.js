
import * as THREE from 'three';

//

const _mat4 = new THREE.Matrix4();

const boxCollisionVectors = [];

for ( let i=0 ; i<16 ; i++ ) {

	boxCollisionVectors.push( new THREE.Vector3() );

}

//

function boxBox( box, colliderBox, targetVec ) {

	// for each box, transform colliding box points so that they
	// can be tested with a AABB collision detection method.

	const foundCollisions = [];

	//

	box.vectors.forEach( (vector, i) => {

		vector.applyMatrix4( box.matrixWorld );

		colliderBox.worldToLocal( vector );

		if ( isPointInAABB( vector, colliderBox ) ) {

			const collisionVec = boxCollisionVectors[ i ];

			collisionVec.copy( vector );
			colliderBox.localToWorld( collisionVec );

			foundCollisions.push( collisionVec );

		}

		colliderBox.localToWorld( vector );

		_mat4.copy( box.matrixWorld );
		_mat4.invert();
		vector.applyMatrix4( _mat4 );

	} );

	//

	colliderBox.vectors.forEach( (vector, i) => {

		vector.applyMatrix4( colliderBox.matrixWorld );

		box.worldToLocal( vector );

		if ( isPointInAABB( vector, box ) ) {

			const collisionVec = boxCollisionVectors[ i + 8 ];

			collisionVec.copy( vector );
			box.localToWorld( collisionVec );

			foundCollisions.push( collisionVec );

		}

		box.localToWorld( vector );

		_mat4.copy( colliderBox.matrixWorld );
		_mat4.invert();
		vector.applyMatrix4( _mat4 );

	} );

	//

	if ( foundCollisions.length > 0 ) {

		targetVec.set( 0, 0, 0 );

		foundCollisions.forEach( col => targetVec.add( col ) );

		targetVec.divideScalar( foundCollisions.length );

		return targetVec

	} else {

		return null

	}

}

//

function isPointInAABB( vec, box ) {

	return (
		vec.x < box.width / 2 &&
		vec.x > -box.width / 2 &&
		vec.y < box.height / 2 &&
		vec.y > -box.height / 2 &&
		vec.z < box.depth / 2 &&
		vec.z > -box.depth / 2
	)

}

//

export default {
	boxBox
}