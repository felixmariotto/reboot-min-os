
import * as THREE from 'three';
import params from '../../params.js';
import Chain from './Chain.js';

//

const _vec = new THREE.Vector3();

//

export default function ChainPoint( info ) {

	const chainPoint = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			chainID: info.chainID,
			isChainPoint: true,
			chainLength: Number( info.length ),
			radius: Number( info.radius ),
			linkLength: info.linkLength,
			pointsNumber: info.pointsNumber,
			spheresNumber: info.spheresNumber,
			intersectPlayer,
			makeHelper,
			makeChain
		}
	);

	chainPoint.position.set(
		Number( info.x ),
		Number( info.y ),
		Number( info.z )
	);

	//

	function intersectPlayer( player ) {

		const playerSphere = player.children[0];

		const penetrationVec = playerSphere.penetrationSphereSphere( playerSphere, this, _vec );

		if ( penetrationVec ) return true

		return false

	}

	//

	function makeChain( player ) {

		const chain = Chain( this );
		// chain.makeHelper();
		chain.chainID = this.chainID;

		chain.attachStartTo( this, 0, 0, 0 );
		chain.attachEndTo( player, 0, 0, 0 );

		return chain

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

	return chainPoint

}