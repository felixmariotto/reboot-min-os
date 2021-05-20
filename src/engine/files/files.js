
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import loadLocalMapFile from './loadLocalMapFile.js';

// MODELS

import mainCharURL from '../../assets/main_char.glb';

// MAP FILES

import playgroundMapURL from '../../assets/mapFiles/playground.txt';

//

const gltfLoader = new GLTFLoader();
const fileLoader = new THREE.FileLoader();

// models loading

const models = {
	mainChar: loadModel( mainCharURL )
};

// map files loading

const maps = {
	playground: loadMap( playgroundMapURL )
};

//

function loadModel( url ) {

	const promise = new Promise( (resolve) => {

		gltfLoader.load( url, (glb) => {

			resolve( glb.scene );

		});

	})

	return promise

};

//

function loadMap( url ) {

	const promise = new Promise( (resolve) => {

		fileLoader.load( url, (data) => {

			resolve( JSON.parse( data ) );

		});

	})

	return promise

}

//

export default {
	models,
	maps,
	loadModel,
	loadLocalMapFile
}
