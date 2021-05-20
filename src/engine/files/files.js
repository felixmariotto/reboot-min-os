
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import loadLocalMapFile from './loadLocalMapFile.js';

import mainCharURL from '../../assets/main_char.glb';

//

const gltfLoader = new GLTFLoader();

const mainChar = loadModel( mainCharURL );

const models = {
	mainChar
};

//

function loadModel( url, priority ) {

	const promise = new Promise( (resolve) => {

		if ( priority ) {

			gltfLoader.load( url, (glb) => {

				resolve( glb.scene );

			});

		} else {

			setTimeout( () => {

				gltfLoader.load( url, (glb) => {

					resolve( glb.scene );

				});

			}, 1000 );
			
		}

	})

	return promise

};

//

export default {
	models,
	loadModel,
	loadLocalMapFile
}
