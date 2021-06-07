
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

import InfiniteGridHelper from './misc/InfiniteGridHelper.js';

import core from './core/core.js';
import files from './files/files.js';
import constants from './misc/constants.js';
import events from './misc/events.js';
import materials from './graphics/materials.js';
import levelManager from './levels/levelManager.js';
import dialogues from './dialogues/dialogues.js';

import cameraControls from './misc/cameraControls.js';
import characterControls from './misc/characterControls.js';
import physics from './physics/physics.js';

//

if ( window ) {

	window.engine = Object.assign(
		{},
		{
			THREE,
			TransformControls,
			OrbitControls,
			GLTFExporter,
			core,
			files,
			cameraControls,
			characterControls,
			materials,
			physics,
			InfiniteGridHelper,
			levelManager,
			dialogues
		},
		constants,
		events
	);

} else {

	console.log( 'error: no window context' )

}
