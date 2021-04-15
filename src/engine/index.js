
import * as THREE from 'three';

import core from './core/core.js';
import files from './files/files.js';
import constants from './misc/constants.js';

import cameraControls from './physics/cameraControls.js';
import characterControls from './physics/characterControls.js';
import physics from './physics/physics.js';

import materials from './graphics/materials.js';

//

if ( window ) {

	window.engine = Object.assign(
		{},
		{
			THREE,
			core,
			files,
			cameraControls,
			characterControls,
			materials,
			physics
		},
		constants
	);

} else {

	console.log( 'error: no window context' )

}
