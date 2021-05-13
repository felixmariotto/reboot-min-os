
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
			sphereEntities: [],
			info,
			updateFromArray
		}
	);

	chainEntity.pointsNumber = Math.floor( chainEntity.length / params.chainPointDistance );
	chainEntity.linkLength = chainEntity.length / ( chainEntity.pointsNumber - 1 );
	chainEntity.spheresNumber = Math.max( 0, chainEntity.pointsNumber - 2 );

	//

	function updateFromArray( typedArray ) {

		for ( let i=0 ; i<this.sphereEntities.length ; i++ ) {

			this.sphereEntities[i].position.set(
				typedArray[ ( i * 3 ) + 0 + 3 ],
				typedArray[ ( i * 3 ) + 1 + 3 ],
				typedArray[ ( i * 3 ) + 2 + 3 ]
			);

		}

	}

	//

	return chainEntity;

}