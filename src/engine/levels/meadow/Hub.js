
import * as THREE from 'three';
import core from '../../core/core.js';

import files from '../../files/files.js';
import Level from '../Level.js';

import ShadowedLight from '../../misc/ShadowedLight.js';

//

export default function MeadowHub( playerInitPos, playerMotionOrigin ) {

	const level = Object.assign(
		Level( playerInitPos, playerMotionOrigin ),
		{
			name: 'meadow-hub',
			mapFile: files.maps.meadowHub,
			// staticModel: files.models.playgroundStaticModel
		}
	);

	level.start( true, true ).then( () => {

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

	} );

	//

	return level

}
