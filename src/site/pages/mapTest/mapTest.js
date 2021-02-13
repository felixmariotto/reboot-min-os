
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import testMapModel from '../../../assets/test_map_merged.glb';
import suzanneHullModel from '../../../assets/suzanne_hull.glb';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.core.init();

	// environment

	/*
	engine.files.load( testMapModel, (glb) => {

		glb.scene.traverse( (child) => {

			if ( child.isMesh ) {

				const envMesh = engine.physics.makeEnvironmentMesh( child.geometry );

				envMesh.makeHelper();

			}
		
		});

	} );
	*/

	// ground

	const ground = engine.physics.makePhysicalBox({
		width: 20,
		height: 0.5,
		depth: 20
	});

	ground.moveTo( 0, -2, 0 );

	// box

	const box = engine.physics.makePhysicalBox({
		width: 1,
		height: 1,
		depth: 1,
		mass: 1
	});

	// sphere

	const sphere = engine.physics.makePhysicalSphere({
		radius: 0.5,
		mass: 1
	});

	sphere.moveTo( 0.5, 2, 0 );

	// suzanne

	engine.files.load( suzanneHullModel, (glb) => {

		const suzanne = engine.physics.makePhysicalHullCompo({
			sourceObject: glb.scene,
			mass: 1
		});

		suzanne.moveTo( 0, 3, 0 );

	} );

	//

	engine.cameraControls.orbitObj( engine.core.scene );

}

//

export default gamePage