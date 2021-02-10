
import * as THREE from 'three';
import core from './core/core.js';
import files from './files/files.js';
import cameraControls from './physics/cameraControls.js';
import characterControls from './physics/characterControls.js';
import materials from './materials/materials.js';
import physics from './physics/physics.js';

//

if ( window ) {

	window.engine = {
		THREE,
		core,
		files,
		cameraControls,
		characterControls,
		materials,
		physics
	}

} else {

	console.log( 'no window context' )

}
