
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
const _euler = new THREE.Euler();

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

	const separatingVec1 = new THREE.Vector3();
	const separatingVec2 = new THREE.Vector3();

	function penetrationBoxBox( boxShape1, boxShape2, targetVec ) {

		const sep1 = boxBoxSAT( boxShape1, boxShape2, separatingVec1 );
		const sep2 = boxBoxSAT( boxShape2, boxShape1, separatingVec2 );

		if ( sep1 && sep2 ) {

			return sep1.lengthSq() > sep2.lengthSq() ? sep2 : sep1;

		} else {

			return null

		}

	}

	// Returns null if it finds a separating axis between the two box,
	// otherwise returns the smallest separating vector in world space.
	// Resource : https://gamedev.stackexchange.com/questions/25397/obb-vs-obb-collision-detection

	const box1AABB = new THREE.Box3();
	const box2AABB = new THREE.Box3();

	const separatingDist = new THREE.Vector3();

	function boxBoxSAT( boxShape1, boxShape2, targetVec ) {

		// We compute boxShape1 AABB in local space

		box1AABB.min.set(
			boxShape1.width / -2,
			boxShape1.height / -2,
			boxShape1.depth / -2
		);

		box1AABB.max.set(
			boxShape1.width / 2,
			boxShape1.height / 2,
			boxShape1.depth / 2
		);

		// we tranform the second box vertices to the first box space

		boxShape2.vertices.forEach( (vert) => {

			vert.applyMatrix4( boxShape2.matrixWorld );

			boxShape1.worldToLocal( vert );

		} );

		// we compute the AABB of the second box in first box space

		box2AABB.setFromPoints( boxShape2.vertices );

		// find the distance between the two AABB in each axis

		let returnVal = null;

		separatingDist.x = Math.max(
			box2AABB.min.x - box1AABB.max.x,
			box1AABB.min.x - box2AABB.max.x
		)

		separatingDist.y = Math.max(
			box2AABB.min.y - box1AABB.max.y,
			box1AABB.min.y - box2AABB.max.y
		)

		separatingDist.z = Math.max(
			box2AABB.min.z - box1AABB.max.z,
			box1AABB.min.z - box2AABB.max.z
		)

		// If the AABBs are overlapping on all axis, then there is collision.
		// We find the smallest distance and set targetVec with it.

		if (
			separatingDist.x < 0 &&
			separatingDist.y < 0 &&
			separatingDist.z < 0
		) {

			returnVal = targetVec;

			targetVec.setScalar( 0 );

			if (
				separatingDist.x > separatingDist.y &&
				separatingDist.x > separatingDist.z
			) {
				targetVec.x = separatingDist.x
			}

			if (
				separatingDist.y > separatingDist.x &&
				separatingDist.y > separatingDist.z
			) {
				targetVec.y = separatingDist.y
			}

			if (
				separatingDist.z > separatingDist.x &&
				separatingDist.z > separatingDist.y
			) {
				targetVec.z = separatingDist.z
			}

			_euler.setFromRotationMatrix( boxShape1.matrixWorld );

			targetVec.applyEuler( _euler );

		}

		// we tranform back the second box vertices to their own space

		boxShape2.vertices.forEach( (vert) => {

			vert.applyMatrix4( boxShape1.matrixWorld );

			boxShape2.worldToLocal( vert );

		} );

		//

		return returnVal

	}

	//

	function deleteHelper() {

		for ( let i=this.children.length - 1 ; i>-1 ; i-- ) {

			this.children[i].material.dispose();
			this.children[i].geometry.dispose();

		}
		
	}

	//

	function computeAABB() {

		if ( !this.children.length ) {

			this.makeHelper();

		}

		if ( !this.aabb ) {

			this.aabb = new THREE.Box3();

		}

		this.aabb.setFromObject( this );

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
		penetrationBoxBox,
		deleteHelper,
		aabb: undefined,
		findNeighborsIn,
		neighbors: new Set(),
		computeAABB
	}

}