
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import loadLocalMapFile from './loadLocalMapFile.js';

// MODELS

import playgroundStaticURL from '../../assets/models/playgroundStatic.glb';

// MAP FILES

import playgroundMapURL from '../../assets/mapFiles/playground.txt';

// TEXTURES

import roomEnvmapURL from '../../assets/images/room_envmap.jpg';

//

const gltfLoader = new GLTFLoader();
const fileLoader = new THREE.FileLoader();
const textureLoader = new THREE.TextureLoader();

// models loading

const models = {
	playgroundStaticModel: loadModel( playgroundStaticURL )
};

// map files loading

const maps = {
	playground: loadMap( playgroundMapURL )
};

// textures loading

const textures = {
	roomEnvmap: loadTexture( roomEnvmapURL )
}

//

function loadModel( url ) {

	const promise = new Promise( (resolve) => {

		gltfLoader.load( url, (glb) => {

			resolve( glb.scene );

		});

	})

	return promise

}

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

function loadTexture( url ) {

	const texture = textureLoader.load( url );
	texture.mapping = THREE.EquirectangularReflectionMapping;
	texture.encoding = THREE.sRGBEncoding;

	return texture

}

//

export default {
	models,
	maps,
	textures,
	loadModel,
	loadLocalMapFile
}
