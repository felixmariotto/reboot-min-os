
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import testMapModel from '../../../assets/test_map_merged.glb';
import suzanneHullModel from '../../../assets/suzanne_hull.glb';
import marcoModel from '../../../assets/marco_model.glb';
import footballMap from '../../../assets/football_map.glb';

import * as THREE from 'three';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.core.init();

	engine.cameraControls.orbitObj( engine.core.scene );

	// physics tests

	const world = engine.physics.World();
	engine.core.scene.add( world );

	const body = engine.physics.Body();

	const box = engine.physics.Box();
	box.makeHelper();

	body.add( box );
	world.add( body );

	console.log( world )

}

//

export default gamePage