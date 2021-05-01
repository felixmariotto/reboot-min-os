
import * as THREE from 'three';
import params from '../../params.js';
import Shape from './Shape.js';

//

const _vec = new THREE.Vector3();
const _vec0 = new THREE.Vector3();

//

export default function Sphere( radius=1 ) {

	function penetrationIn( collidingShape, targetVec ) {

		if ( collidingShape.isBox ) {

			return this.penetrationSphereBox( this, collidingShape, targetVec );

		} else if ( collidingShape.isSphere ) {

			return this.penetrationSphereSphere( this, collidingShape, targetVec );

		}

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
		Shape(),
		{
			radius,
			isSphere: true,
			makeHelper,
			penetrationIn
		}
	)

}
