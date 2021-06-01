
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import loadLocalMapFile from './loadLocalMapFile.js';

// MODELS

import playgroundStaticURL from '../../assets/models/test.glb';

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

			// traverse the gltf scene to register the mesh instances

			const instances = {};

			glb.scene.traverse( (child) => {

				if ( child.name.includes( 'instance' ) ) {

					// eg: 'bush_instance_1' => 'bush'
					const instanceName = child.name.substring( 0, child.name.indexOf( 'instance' ) - 1 )

					if ( !instances[ instanceName] ) instances[ instanceName ] = [];

					instances[ instanceName ].push( child );

				}

			} );

			// create InstancedMeshes if necessary

			// update every object matrix, so later we can compute the matrixWorld of meshes.
			glb.scene.updateWorldMatrix( false, true );

			for ( let instanceName in instances ) {

				const instList = instances[ instanceName ];

				const idx = instList.findIndex( m => m.name === instanceName + '_instance' );

				const originalInst = instList.splice( idx, 1 )[0];

				const geometry = originalInst.geometry.clone();
				const material = originalInst.material.clone();
				const instancedMesh = new THREE.InstancedMesh( geometry, material, instList.length );
				instancedMesh.name = instanceName;
				glb.scene.add( instancedMesh );

				deleteObject( originalInst );

				for ( let i = 0 ; i < instList.length ; i ++ ) {

					// get global transform, because we add the instancedMesh to glb.scene.
					instList[i].updateMatrixWorld( true );

					instancedMesh.setMatrixAt( i, instList[i].matrixWorld );

					// remove parent of the instance ( the collection in Blender )
					deleteObject( instList[i].parent );

					deleteObject( instList[i] );

				}

			}

			//

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

function deleteObject( object3D ) {

	if ( object3D.material ) object3D.material.dispose();
	if ( object3D.geometry ) object3D.geometry.dispose();
	object3D.removeFromParent();

}

//

export default {
	models,
	maps,
	textures,
	loadModel,
	loadLocalMapFile
}
