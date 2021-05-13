
/*
An entity is the shallow conterpart of a body whose physics is computed
in the web worker. It get udpated every frame through entity.updateFromArr
with a new position.
*/

import * as THREE from 'three';
import params from '../params.js';

//

export default function Entity( info ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			name: info.name,
			serial: info.serial,
			info,
			makeHelper,
			updateFromArr,
			setVectorArray
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

function updateFromArr( typedArr ) {

	this.position.set(
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
