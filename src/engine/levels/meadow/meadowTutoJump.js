
import * as THREE from 'three';
import core from '../../core/core.js';

import files from '../../files/files.js';
import Level from '../Level.js';

import ShadowedLight from '../../misc/ShadowedLight.js';

//

export default function MeadowTutoJump( params ) {

	const level = Object.assign(
		Level( params ),
		{
			name: 'meadow-tuto-jump',
			mapFile: files.maps.meadowTutoJump,
			// staticModel: files.models.playgroundStaticModel,
			init
		}
	);

	// setup the routes from this level to another

	level.routes[ 'gate-01' ] = {
		levelName: 'meadow-hub',
		playerInit: [ -12, 3.5, 21.5 ],
		playerDir: '-z',
		enterBiome: 'meadows'
	};

	level.routes[ 'gate-02' ] = {
		levelName: 'meadow-tuto-point',
		playerInit: [ -14, -0.5, -6.5 ],
		playerDir: '+x',
		chainID: 1
	};

	//

	level.start( true, true, false ).then( () => level.init() );

	//

	return level

}

//

function init() {

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

	this.setEnvmap( files.textures.roomEnvmap )

}
