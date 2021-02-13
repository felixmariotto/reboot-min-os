
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import testMapModel from '../../../assets/test_map_merged.glb';

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

	// box

	const box = engine.physics.makePhysicalBox();

	engine.cameraControls.orbitObj( box );

}

//

export default gamePage