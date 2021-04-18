
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import loadLocalMapFile from './loadLocalMapFile.js';

//

const textureLoader = new THREE.TextureLoader();

const loaders = {
	'glb': new GLTFLoader(),
	'jpg': textureLoader,
	'png': textureLoader
}

//

function load( url, callback ) {

	let extension = url.split('.');
	extension = extension[ extension.length - 1 ];

	loaders[ extension ].load( url, callback );

}

//

export default {
	load,
	loadLocalMapFile
}
