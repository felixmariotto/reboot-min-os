
import * as THREE from 'three';
import params from '../../../params.js';

//

export default function Box( width=1, height=1, depth=1 ) {

	function makeHelper() {

		const mesh = new THREE.Mesh(
			new THREE.BoxGeometry( this.width, this.height, this.depth ),
			params.helpersMaterial
		);

		mesh.position.copy( this.position );

		return mesh

	}

	return {
		width,
		height,
		depth,
		type: 'box',
		position: new THREE.Vector3(),
		makeHelper
	}

}