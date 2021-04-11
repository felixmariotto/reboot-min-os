
import * as THREE from 'three';

//

export default function Body( mass=0.5 /* between 0 and 1 */ ) {

	function addShape() {

		this.shapes.push( ...arguments );

	}

	function initHelper( scene ) {

		this.helper = new THREE.Group();

		scene.add( this.helper );

		this.shapes.forEach( (shape) => {

			this.helper.add( shape.makeHelper() );

		} );

	}

	return {
		position: new THREE.Vector3(),
		velocity: new THREE.Vector3(),
		mass,
		shapes: [],
		addShape,
		initHelper
	}

}