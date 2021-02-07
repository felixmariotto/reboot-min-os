
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//

const loaders = {
	'glb': new GLTFLoader()
}

//

function load( url, callback ) {

	const loader = ( () => {

		let extension = url.split('.');
		extension = extension[ extension.length - 1 ];

		loaders[ extension ].load( url, callback );

	} )()

}

//

export default {
	load
}
