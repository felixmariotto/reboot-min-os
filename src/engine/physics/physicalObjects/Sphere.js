
import * as THREE from 'three';
import params from '../../params.js';

//

const _vec = new THREE.Vector3();

//

export default function Sphere( radius=1 ) {

	function penetrationIn( collidingShape, targetVec ) {

		if ( collidingShape.isBox ) {

			const sphereCenter = _vec.copy( this.position );

			// this.parent.updateMatrix();
			this.localToWorld( sphereCenter );

			console.log( 'sphereCenter', sphereCenter );

			console.log( this.parent )

			debugger

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