
/*
An entity is the shallow conterpart of a body whose physics is computed
in the web worker. It get udpated every frame through entity.updatePosition
with a new position.
*/

import * as THREE from 'three';
import params from '../params.js';

//

const _vec = new THREE.Vector3();

const clock = new THREE.Clock();

//

export default function Entity( info ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			isEntity: true,
			name: info.name,
			serial: info.serial,
			info,
			makeHelper,
			updatePosition,
			updateVelocity,
			setVectorArray,
			updateVelocities,
			velocity: new THREE.Vector3(),
			targetPos: new THREE.Vector3()
		}
	)

}

//

function makeHelper() {

	this.info.shapes.forEach( (shapeInfo) => {

		let shape;

		switch ( shapeInfo.type ) {

			case 'box' :
				shape = new THREE.Mesh(
					new THREE.BoxGeometry( shapeInfo.width, shapeInfo.height, shapeInfo.depth ),
					params.helpersMaterial
				)
				break

			case 'sphere' :
				shape = new THREE.Mesh(
					new THREE.IcosahedronGeometry( shapeInfo.radius, 4 ),
					params.helpersMaterial
				)
				break

			case 'cylinder' :
				shape = new THREE.Mesh(
					new THREE.CylinderGeometry( shapeInfo.radius, shapeInfo.radius, shapeInfo.height, 12 ),
					params.helpersMaterial
				)
				break

		}

		shape.position.copy( shapeInfo.pos );
		shape.rotation.copy( shapeInfo.rot );

		this.add( shape );

	} );

}

// update with the position data sent by the web worker.
// typedArr is the whole transferable typed array.
// this.serial was computed by World on initialization.

let counter = 0;

function updatePosition( typedArr ) {

	this.targetPos.set(
		typedArr[ ( this.serial * 3 ) + 0 ],
		typedArr[ ( this.serial * 3 ) + 1 ],
		typedArr[ ( this.serial * 3 ) + 2 ]
	);

	/*
	_vec.set(
		typedArr[ ( this.serial * 3 ) + 0 ],
		typedArr[ ( this.serial * 3 ) + 1 ],
		typedArr[ ( this.serial * 3 ) + 2 ]
	);

	const ecart = ( this.position.z - _vec.z );

	// if ( this.isPlayer ) console.log( _vec.distanceTo( this.position ) )
	// if ( this.isPlayer ) console.log( clock.getDelta() / (1/60) )
	if ( this.isPlayer ) console.log( 'écart : ' + ecart + ' / temps : ' + clock.getDelta() );

	counter++
	if ( counter > 1000 ) debugger

	this.position.copy( _vec );
*/

}

function updateVelocity( typedArr ) {

	this.velocity.set(
		typedArr[ ( this.serial * 3 ) + 0 ],
		typedArr[ ( this.serial * 3 ) + 1 ],
		typedArr[ ( this.serial * 3 ) + 2 ]
	);

}

//

function setVectorArray( x, y, z, typedArr ) {

	typedArr[ ( this.serial * 3 ) + 0 ] = x;
	typedArr[ ( this.serial * 3 ) + 1 ] = y;
	typedArr[ ( this.serial * 3 ) + 2 ] = z;

}

//

function updateVelocities( typedArr ) {

	this.setVectorArray(
		this.velocity.x,
		this.velocity.y,
		this.velocity.z,
		typedArr
	);

}
