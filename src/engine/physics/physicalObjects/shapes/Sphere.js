
import * as THREE from 'three';
import params from '../../../params.js';

//

const _vec = new THREE.Vector3();

//

export default function Sphere( radius=0.5 ) {

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry( this.radius, 4 ),
			params.helpersMaterial
		);

		this.add( mesh );

		return mesh

	}

	//

	function collideWith( colliderShape, targetVec ) {

		return null;

	}

	//

	function expandBB() {

		_vec.copy( this.position );
		_vec.addScalar( this.radius );

		this.parent.boundingBox.expandByPoint( _vec );

		_vec.copy( this.position );
		_vec.subScalar( this.radius );

		this.parent.boundingBox.expandByPoint( _vec );

	}

	//

	return Object.assign(
		Object.create( new THREE.Object3D ),
		{
			radius,
			type: 'sphere',
			makeHelper,
			collideWith,
			expandBB
		}
	);

}