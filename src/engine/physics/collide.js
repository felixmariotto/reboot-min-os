
import * as THREE from 'three';

//

const _box = new THREE.Box3();
const _mat = new THREE.Matrix4();
const _vec1 = new THREE.Vector3();
const _vec2 = new THREE.Vector3();

// collide capsule
// blind paste from https://github.com/gkjohnson/three-mesh-bvh/blob/master/example/characterMovement.js

function capsuleAgainstMesh( capsule, mesh, targetLine ) {

	const capsuleInfo = capsule.capsuleInfo;
	_box.makeEmpty();
	_mat.copy( mesh.matrixWorld ).invert();
	targetLine.copy( capsuleInfo.segment );

	targetLine.start.applyMatrix4( capsule.matrixWorld ).applyMatrix4( _mat );
	targetLine.end.applyMatrix4( capsule.matrixWorld ).applyMatrix4( _mat );

	_box.expandByPoint( targetLine.start );
	_box.expandByPoint( targetLine.end );

	_box.min.addScalar( - capsuleInfo.radius );
	_box.max.addScalar( capsuleInfo.radius );

	mesh.geometry.boundsTree.shapecast(
		mesh,
		box => box.intersectsBox( _box ),
		tri => {

			const triPoint = _vec1;
			const capsulePoint = _vec2;

			const distance = tri.closestPointToSegment( targetLine, triPoint, capsulePoint );

			if ( distance < capsuleInfo.radius ) {

				const depth = capsuleInfo.radius - distance;
				const direction = capsulePoint.sub( triPoint ).normalize();

				targetLine.start.addScaledVector( direction, depth );
				targetLine.end.addScaledVector( direction, depth );

			}

		}
	);

}

export default {
	capsuleAgainstMesh
}