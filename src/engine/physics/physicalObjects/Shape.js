
/*

Functions common to any type of shapes :
- Collision detection functions returning a penetration vector.
- Remove helper
- Compute AABB ( axis aligned bounding box )

*/

import * as THREE from 'three';
import params from '../../params.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();
const _vec2 = new THREE.Vector2();

//

export default function Shape() {

	let sphereToBox;

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

		sphereToBox = closestPoint.distanceTo( sphereCenter );

		if ( sphereToBox < sphereShape.radius ) {

			targetVec
			.copy( closestPoint )
			.applyMatrix4( boxShape.matrixWorld );

			sphereShape.parent.worldToLocal( targetVec );

			targetVec
			.sub( sphereShape.position )
			.setLength( sphereShape.radius - sphereToBox );

			return targetVec

		}

		//

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

		//

		return null

	}

	//

	let sphereToCylinder;

	function penetrationSphereCylinder( sphereShape, cylinderShape, targetVec ) {

		const sphereCenter = _vec.copy( sphereShape.position );

		sphereCenter.applyMatrix4( sphereShape.matrixWorld );

		cylinderShape.worldToLocal( sphereCenter );

		// get cylinder closest point to sphere center

		_vec2
		.set( sphereCenter.x, sphereCenter.z )
		.clampLength( 0, cylinderShape.radius );

		const closestPoint = _vec0.set(
			_vec2.x,
			Math.max( -cylinderShape.height / 2, Math.min( sphereCenter.y, cylinderShape.height / 2 ) ),
			_vec2.y
		);

		// distance between closest point and sphere center

		sphereToCylinder = closestPoint.distanceTo( sphereCenter );

		if ( sphereToCylinder < sphereShape.radius ) {

			targetVec
			.copy( closestPoint )
			.applyMatrix4( cylinderShape.matrixWorld );

			sphereShape.parent.worldToLocal( targetVec );

			targetVec
			.sub( sphereShape.position )
			.setLength( sphereShape.radius - sphereToCylinder );

			return targetVec

		}

		//

		return null

	}

	//

	function deleteHelper() {

		for ( let i=this.children.length - 1 ; i>-1 ; i-- ) {

			this.children[i].material.dispose();
			this.children[i].geometry.dispose();

		}

		this.clear();
		
	}

	//

	function computeAABB() {

		let mustDeleteHelper;

		if ( !this.children.length ) {

			this.makeHelper();

			mustDeleteHelper = true;

		}

		this.aabb = new THREE.Box3();

		this.aabb.setFromObject( this );

		if ( mustDeleteHelper ) this.deleteHelper();

	}

	//

	function findNeighborsIn( world ) {

		// since we only do that for sphere against other shapes,
		// we use shape.radius instead of the AABB in spatialIndex.findNeighborsOf
		// this.computeAABB();

		world.spatialIndex.findNeighborsOf( this );

		return this.neighbors

	}

	//

	return {
		penetrationSphereBox,
		penetrationSphereSphere,
		penetrationSphereCylinder,
		deleteHelper,
		computeAABB,
		aabb: undefined,
		findNeighborsIn,
		neighbors: new Set()
	}

}