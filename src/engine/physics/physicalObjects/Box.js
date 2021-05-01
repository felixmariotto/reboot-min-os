
import * as THREE from 'three';
import params from '../../params.js';
import Shape from './Shape.js';

//

export default function Box( width=1, height=1, depth=1 ) {

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.BoxGeometry( this.width, this.height, this.depth ),
			params.helpersMaterial
		)

		this.add( mesh );

	}

	return Object.assign(
		Object.create( new THREE.Object3D() ),
		Shape(),
		{
			width,
			height,
			depth,
			isBox: true,
			makeHelper
		}
	)

}
