
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import testMapModel from '../../../assets/test_map_merged.glb';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.threeCore.init();

	engine.files.load( testMapModel, (glb) => {

		glb.scene.traverse( (child) => {

			if ( child.isMesh ) {

				child.material = new engine.THREE.MeshNormalMaterial();

				engine.worldPhysics.setEnvironmentGeom( child.geometry );

				engine.threeCore.scene.add( child );

			}
		
		});

	} );

	const playerCapsule = engine.worldPhysics.makePlayerCapsule( 0.25, 1 );

	// engine.cameraControls.followObj( playerCapsule );
	engine.cameraControls.orbitDynamicObj( playerCapsule );

	engine.characterControls.control( playerCapsule );

}

//

export default gamePage