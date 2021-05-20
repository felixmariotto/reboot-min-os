
import * as THREE from 'three';

import files from '../files/files.js';
import Level from './Level.js';

//

export default function Playground() {

	const level = Object.assign(
		Level(),
		{
			mapFile: files.maps.playground,
			staticModel: files.models.playgroundStaticModel
		}
	);

	level.start();

	// lights

	const light = new THREE.AmbientLight( 0x404040 ); // soft white light
	const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	
	level.scene.add( light, directionalLight );

	//

	return level

};