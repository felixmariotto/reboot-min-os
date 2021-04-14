
import * as THREE from 'three';
import params from '../../params.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

//

export default function Sphere( radius=1 ) {

	function penetrationIn( collidingShape, targetVec ) {

		if ( collidingShape.isBox ) {

			const sphereCenter = _vec.copy( this.position );

			sphereCenter.applyMatrix4( this.matrixWorld );

			collidingShape.worldToLocal( sphereCenter );

			// console.log( 'sphereCenter', sphereCenter );
			// console.log( 'collidingShape', collidingShape );

			// get box closest point to sphere center by clamping
			const closestPoint = _vec0.set(
				Math.max( -collidingShape.width / 2, Math.min( sphereCenter.x, collidingShape.width / 2 ) ),
				Math.max( -collidingShape.height / 2, Math.min( sphereCenter.y, collidingShape.height / 2 ) ),
				Math.max( -collidingShape.depth / 2, Math.min( sphereCenter.z, collidingShape.depth / 2 ) )
			);

			// distance between closest point and sphere center
			const distance = Math.sqrt(
				( closestPoint.x - sphereCenter.x ) * ( closestPoint.x - sphereCenter.x ) +
				( closestPoint.y - sphereCenter.y ) * ( closestPoint.y - sphereCenter.y ) +
				( closestPoint.z - sphereCenter.z ) * ( closestPoint.z - sphereCenter.z )
			);

			// console.log( 'distance', distance );
			// console.log( 'y', y )

			if ( distance < this.radius ) {

				/*
				console.log('intersect')
				debugger
				*/

				targetVec.copy( closestPoint );

				targetVec.applyMatrix4( collidingShape.matrixWorld );

				this.worldToLocal( targetVec );

				targetVec.sub( this.position );

				targetVec.setLength( this.radius - distance + 0.05 );

				return targetVec

			} else {

				return null

			}

		}

		return targetVec

	}

	//

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry( this.radius, 4 ),
			params.helpersMaterial
		)

		this.add( mesh );

	}

	//

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			radius,
			isSphere: true,
			makeHelper,
			penetrationIn
		}
	)

}