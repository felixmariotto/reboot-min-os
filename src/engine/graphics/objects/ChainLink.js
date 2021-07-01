
import * as THREE from 'three';
import params from '../../params.js';
import materials from '../materials.js';

//

export default function ChainLink( idx ) {

	const geometry = new THREE.IcosahedronGeometry( params.chainSphereRadius, 1 );

	const posAttrib = geometry.attributes.position;

	const array = new Float32Array( posAttrib.count );
	array.fill( idx );

	geometry.setAttribute( 'idx', new THREE.BufferAttribute( array, 1 ) );

	return new THREE.Mesh(
		geometry,
		materials.chainMaterial
	)

}
