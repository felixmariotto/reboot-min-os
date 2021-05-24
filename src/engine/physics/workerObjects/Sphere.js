
import * as THREE from 'three';
import params from '../../params.js';
import Shape from './Shape.js';

//

export default function Sphere( radius=1 ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		Shape(),
		{
			radius,
			isSphere: true,
			penetrationIn,
			makeMesh
		}
	)

}

//

function penetrationIn( collidingShape, targetVec ) {

	if ( collidingShape.isBox ) {

		return this.penetrationSphereBox( this, collidingShape, targetVec );

	} else if ( collidingShape.isSphere ) {

		return this.penetrationSphereSphere( this, collidingShape, targetVec );

	} else if ( collidingShape.isCylinder ) {

		return this.penetrationSphereCylinder( this, collidingShape, targetVec );

	}

}

//

function makeMesh() {

	this.add( new THREE.Mesh(
		new THREE.IcosahedronGeometry( this.radius, 4 ),
		params.helpersMaterial
	) );

}
