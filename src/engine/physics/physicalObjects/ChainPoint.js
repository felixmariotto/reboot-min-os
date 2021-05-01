
import * as THREE from 'three';
import params from '../../params.js';

//

const _vec = new THREE.Vector3();

//

export default function ChainPoint() {

	function intersectPlayer( player ) {

		const playerSphere = player.children[0];

		const penetrationVec = playerSphere.penetrationSphereSphere( playerSphere, this, _vec );

		if ( penetrationVec ) return true

		return false

	}

	//

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry( this.radius, 2 ),
			params.cpHelpersMaterial
		)

		this.add( mesh );

	}


	//

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isChainPoint: true,
			chainLength: 20,
			radius: 1,
			intersectPlayer,
			makeHelper
		}
	)

}