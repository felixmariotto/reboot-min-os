
import * as THREE from 'three';
import threeCore from './core/threeCore.js';
import files from './files/files.js';
import cameraControls from './physics/cameraControls.js';
import characterControls from './physics/characterControls.js';
import materials from './materials/materials.js';
import worldPhysics from './physics/worldPhysics.js';

//

if ( window ) {

	window.engine = {
		THREE,
		threeCore,
		files,
		cameraControls,
		characterControls,
		materials,
		worldPhysics
	}

} else {

	console.log( 'no window context' )

}
