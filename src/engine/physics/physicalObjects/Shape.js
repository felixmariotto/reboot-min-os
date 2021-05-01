
/*

Collision detection functions returning a penetration vector.

*/

import * as THREE from 'three';
import params from '../../params.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

//

export default function Shape() {

	function penetrationSphereBox( sphereShape, boxShape, targetVec ) {

		const sphereCenter = _vec.copy( sphereShape.position );

		sphereCenter.applyMatrix4( sphereShape.matrixWorld );

		boxShape.worldToLocal( sphereCenter );

		// get box closest point to sphere center by clamping
		const closestPoint = _vec0.set(
			Math.max( -boxShape.width / 2, Math.min( sphereCenter.x, boxShape.width / 2 ) ),
			Math.max( -boxShape.height / 2, Math.min( sphereCenter.y, boxShape.height / 2 ) ),
			Math.max( -boxShape.depth / 2, Math.min( sphereCenter.z, boxShape.depth / 2 ) )
		);

		// distance between closest point and sphere center
		const distance = closestPoint.distanceTo( sphereCenter );

		if ( distance < sphereShape.radius ) {

			targetVec
			.copy( closestPoint )
			.applyMatrix4( boxShape.matrixWorld );

			sphereShape.parent.worldToLocal( targetVec );

			targetVec
			.sub( sphereShape.position )
			.setLength( sphereShape.radius - distance );

			return targetVec

		}

		return null

	}

	//

	let sphereToSphere, radiusSum;

	function penetrationSphereSphere( sphereShape1, sphereShape2, targetVec ) {

		const center1 = _vec.setScalar( 0 );
		const center2 = _vec0.setScalar( 0 );

		sphereShape1.localToWorld( center1 );
		sphereShape2.localToWorld( center2 );

		//

		sphereToSphere = center1.distanceTo( center2 );
		radiusSum = sphereShape1.radius + sphereShape2.radius;

		if ( sphereToSphere < radiusSum ) {

			return targetVec
			.copy( center2 )
			.sub( center1 )
			.normalize()
			.multiplyScalar( radiusSum - sphereToSphere )

		}

		return null

	}

	//

	return {
		penetrationSphereBox,
		penetrationSphereSphere
	}

}