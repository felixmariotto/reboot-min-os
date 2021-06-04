
import * as THREE from 'three';
import core from '../core/core.js';

import files from '../files/files.js';
import Level from './Level.js';

import materials from '../graphics/materials.js';

import ShadowedLight from '../misc/ShadowedLight.js';

//

export default function Playground() {

	const level = Object.assign(
		Level(),
		{
			mapFile: files.maps.playground,
			staticModel: files.models.playgroundStaticModel
		}
	);

	level.start( true, false ).then( () => {

		// level.staticModel.then( v => console.log('static model children', v.children ))

		// lights

		const light = new THREE.AmbientLight( 0x404040 ); // soft white light
		const dirLight = ShadowedLight({
			color: 0xffcfdf,
			x: -15,
			y: 50,
			z: 15,
			intensity: 2,
			resolution: 1024,
			width: 100,
			far: 100,
			useHelpers: false,
			bias: -0.002,
			normalBias: 0.002
		})
		
		level.scene.add( light, dirLight, dirLight.helpers );

		// envmap

		// cannot be level.scene
		core.scene.environment = files.textures.roomEnvmap;
		core.scene.background = files.textures.roomEnvmap;

		// materials

		const grassPatch = level.scene.getObjectByName('grass_patch');

		grassPatch.material = materials.grassMaterial;

		// shadows

		/*
		core.scene.traverse( (child) => {

			if ( child.isMesh ) {

				child.castShadow = true;
				child.receiveShadow = true;

			}

		} );
		*/

	} );

	//

	return level

}
