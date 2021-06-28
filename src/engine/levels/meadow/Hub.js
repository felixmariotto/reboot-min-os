
import * as THREE from 'three';
import core from '../../core/core.js';

import files from '../../files/files.js';
import Level from '../Level.js';

import ShadowedLight from '../../misc/ShadowedLight.js';

//

export default function MeadowHub( params ) {

	const level = Object.assign(
		Level( params ),
		{
			name: 'meadow-hub',
			mapFile: files.maps.meadowHub,
			// staticModel: files.models.playgroundStaticModel,
			init
		}
	);

	// setup the routes from this level to another

	level.routes[ 'gate-01' ] = {
		levelName: 'meadow-tuto-jump',
		playerInit: [ -13.5, 2.5, 22.5 ],
		playerDir: '-z',
		chainID: 1
	};

	//

	level.start( true, true, true ).then( () => level.init() );

	//

	return level

}

//

function init() {

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
	
	this.scene.add( light, dirLight, dirLight.helpers );

	this.setEnvmap( files.textures.roomEnvmap );

}
