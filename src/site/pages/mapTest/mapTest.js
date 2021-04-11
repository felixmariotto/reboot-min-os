
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import testMapModel from '../../../assets/test_map_merged.glb';
import suzanneHullModel from '../../../assets/suzanne_hull.glb';
import marcoModel from '../../../assets/marco_model.glb';
import footballMap from '../../../assets/football_map.glb';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.core.init();

	engine.cameraControls.orbitObj( engine.core.scene );

	// physics tests

	const world = engine.physics.World();

	const body = engine.physics.Body();
	body.velocity.set( 0, 1, 0 );

	const boxShape = engine.physics.Box();

	boxShape.position.set( 0.5, 0.5, 0 );

	const sphereShape = engine.physics.Sphere();

	body.addShape( boxShape, sphereShape );

	body.initHelper( engine.core.scene );

	world.addBody( body );

	world.play();

	setTimeout( () => {
		world.pause();
	}, 1000 );

}

//

export default gamePage