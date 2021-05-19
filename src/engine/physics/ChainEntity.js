
import * as THREE from 'three';

import params from '../params.js';
import Entity from './Entity.js';

//

export default function ChainEntity( info ) {

	const chainEntity = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			chainPointPos: new THREE.Vector3(
				Number( info.x ),
				Number( info.y ),
				Number( info.z )
			),
			chainID: info.chainID,
			length: Number( info.length ),
			radius: Number( info.radius ),
			enabled: info.enabled,
			init: info.init,
			active: info.init,
			// this is added manually to the world, not the entity,
			// since the chain links positions are computed in world space.
			spheresContainer: new THREE.Group(),
			sphereEntities: [],
			info,
			updateFromArray,
			setPosArray,
			addLength,
			makeHelper
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

		chainEntity.spheresContainer.add( sphereEntity );

		sphereEntity.makeHelper();

	}

	//

	return chainEntity;

}

//

function updateFromArray( typedArray ) {

	for ( let i=0 ; i<this.sphereEntities.length ; i++ ) {

		this.sphereEntities[i].targetPos.set(
			typedArray[ ( i * 3 ) + 0 + 3 ],
			typedArray[ ( i * 3 ) + 1 + 3 ],
			typedArray[ ( i * 3 ) + 2 + 3 ]
		);

	}

}

//

function setPosArray( typedArray ) {

	for ( let i=0 ; i<this.sphereEntities.length ; i++ ) {

		typedArray[ ( i * 3 ) + 0 + 3 ] = this.sphereEntities[i].position.x;
		typedArray[ ( i * 3 ) + 1 + 3 ] = this.sphereEntities[i].position.y;
		typedArray[ ( i * 3 ) + 2 + 3 ] = this.sphereEntities[i].position.z;

	}

}

//

function addLength( lengthToAdd ) {

	this.length += lengthToAdd;

	this.pointsNumber = Math.floor( this.length / params.chainPointDistance );

	this.linkLength = this.length / ( this.pointsNumber - 1 );

	const newSpheresNumber = Math.max( 0, this.pointsNumber - 2 );

	const spheresToAdd = newSpheresNumber - this.spheresNumber;

	for ( let i=0 ; i<spheresToAdd ; i++ ) {

		const sphereEntity = Entity({
			name: 'chain-link-' + info.chainID + '-' + ( this.spheresNumber + 1 + i ),
			shapes: [ {
				type: "sphere",
				radius: params.chainSphereRadius,
				pos: { x: 0, y: 0, z: 0 },
				rot: { _x: 0, _y: 0, _z: 0, _order: "XYZ" }
			} ]
		});

		chainEntity.sphereEntities.splice( 1, 0, sphereEntity );

		chainEntity.spheresContainer.add( sphereEntity );

		sphereEntity.makeHelper();

		sphereEntity.position.lerpVectors(
			this.sphereEntities[0].position,
			this.sphereEntities[2].position,
			0.5
		);

	}

	this.spheresNumber = newSpheresNumber;

}

//

function makeHelper() {

	const mesh = new THREE.Mesh(
		new THREE.IcosahedronGeometry( this.radius, 2 ),
		params.cpHelpersMaterial
	)

	mesh.position.copy( this.chainPointPos );

	this.add( mesh );

}