
import * as THREE from 'three';

import params from '../params.js';
import Entity from './Entity.js';

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
			updateFromArray,
			addLength
		}
	);

	chainEntity.pointsNumber = Math.floor( chainEntity.length / params.chainPointDistance );
	chainEntity.linkLength = chainEntity.length / ( chainEntity.pointsNumber - 1 );
	chainEntity.spheresNumber = Math.max( 0, chainEntity.pointsNumber - 2 );

	// create chain spheres

	for ( let j=0 ; j<chainEntity.spheresNumber ; j++ ) {

		const sphereEntity = Entity({
			name: 'chain-link-' + info.chainID + '-' + j,
			shapes: [ {
				type: "sphere",
				radius: params.chainSphereRadius,
				pos: { x: 0, y: 0, z: 0 },
				rot: { _x: 0, _y: 0, _z: 0, _order: "XYZ" }
			} ]
		});

		chainEntity.sphereEntities.push( sphereEntity );

		chainEntity.add( sphereEntity );

		sphereEntity.makeHelper();

	}

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

	function addLength( lengthToAdd ) {

		this.length += lengthToAdd;

		this.pointsNumber = Math.floor( this.length / params.chainPointDistance );

		this.linkLength = this.length / ( this.pointsNumber - 1 );

		const newSpheresNumber = Math.max( 0, this.pointsNumber - 2 );

		const spheresToAdd = newSpheresNumber - this.spheresNumber;

		this.spheresNumber = newSpheresNumber;

		for ( let i=0 ; i<spheresToAdd ; i++ ) {

			console.log( 'add sphere' );

			/*
			const sphereShape = Sphere( params.chainSphereRadius );

			const sphereBody = Body(
				constants.DYNAMIC_BODY,
				params.chainWeight,
				params.chainMass
			);

			sphereBody.isChainLink = true;

			sphereBody.add( sphereShape );
			this.spheres[0].parent.add( sphereBody );

			this.spheres.splice( 1, 0, sphereBody );
			this.points.splice( 2, 0, sphereBody.position );

			if ( this.hasHelpers ) {

				sphereBody.children[0].makeHelper()

			}

			sphereBody.position.lerpVectors( this.points[1], this.points[3], 0.5 );
			*/

		}

	}

	//

	return chainEntity;

}