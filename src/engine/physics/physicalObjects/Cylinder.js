
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

			// get box closest point to sphere center by clamping
			const closestPoint = _vec0.set(
				Math.max( -collidingShape.width / 2, Math.min( sphereCenter.x, collidingShape.width / 2 ) ),
				Math.max( -collidingShape.height / 2, Math.min( sphereCenter.y, collidingShape.height / 2 ) ),
				Math.max( -collidingShape.depth / 2, Math.min( sphereCenter.z, collidingShape.depth / 2 ) )
			);

			// distance between closest point and sphere center
			const distance = closestPoint.distanceTo( sphereCenter );

			if ( distance < this.radius ) {

				targetVec
				.copy( closestPoint )
				.applyMatrix4( collidingShape.matrixWorld );

				this.parent.worldToLocal( targetVec );

				targetVec
				.sub( this.position )
				.setLength( this.radius - distance );

				return targetVec

			}

			return null

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
