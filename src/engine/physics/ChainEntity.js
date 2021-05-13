
import * as THREE from 'three';

import params from '../params.js';

//

export default function ChainEntity( info ) {

	const chainEntity = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			chainID: info.chainID,
			length: Number( info.length ),
			enabled: info.enabled,
			init: info.init,
			active: info.init,
			info
		}
	);

	chainEntity.pointsNumber = Math.floor( chainEntity.length / params.chainPointDistance );
	chainEntity.linkLength = chainEntity.length / ( chainEntity.pointsNumber - 1 );
	chainEntity.spheresNumber = Math.max( 0, chainEntity.pointsNumber - 2 );

	chainEntity.sphereEntities = [];

	return chainEntity;

}