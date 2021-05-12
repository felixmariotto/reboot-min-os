
import * as THREE from 'three';
import params from '../params.js';

//

export default function Entity( info ) {

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		{
			name: info.name,
			info,
			makeHelper
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