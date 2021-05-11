
import * as THREE from 'three';
import InfiniteGridHelper from './misc/InfiniteGridHelper.js';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import core from './core/core.js';
import files from './files/files.js';
import constants from './misc/constants.js';
import events from './misc/events.js';

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
			TransformControls,
			OrbitControls,
			core,
			files,
			cameraControls,
			characterControls,
			materials,
			physics,
			InfiniteGridHelper
		},
		constants,
		events
	);

} else {

	console.log( 'error: no window context' )

}
