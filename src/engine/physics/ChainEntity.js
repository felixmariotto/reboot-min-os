
import * as THREE from 'three';

import params from '../params.js';

//

export default function ChainEntity( info ) {

	const chainEntity = Object.assign(
		Object.create( new THREE.Object3D() ),
		{
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


	/*
	this.length = length;

	this.pointsNumber = Math.floor( this.length / params.chainPointDistance );

	this.linkLength = this.length / ( this.pointsNumber - 1 );

	this.spheresNumber = Math.max( 0, this.pointsNumber - 2 );

	this.spheres = [];

	for ( let i=0 ; i<this.spheresNumber ; i++ ) {

		const sphereShape = Sphere( params.chainSphereRadius );

		const sphereBody = Body(
			constants.DYNAMIC_BODY,
			params.chainWeight,
			params.chainMass
		);

		sphereBody.isChainLink = true;

		sphereBody.add( sphereShape );

		this.spheres.push( sphereBody );

	}

	this.startPoint = new THREE.Vector3();
	this.endPoint = new THREE.Vector3();

	this.points = [ this.startPoint ];
	this.points.push( ...this.spheres.map( sphereBody => sphereBody.position ) );
	this.points.push( this.endPoint );
	*/

}