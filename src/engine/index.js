
import * as THREE from 'three';
import threeCore from './core/threeCore.js';
import files from './files/files.js';
import cameraControls from './physics/cameraControls.js';

//

if ( window ) {

	window.engine = {
		THREE,
		threeCore,
		files,
		cameraControls
	}

} else {

	console.log( 'no window context' )

}
