
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import testMapModel from '../../../assets/test_map_merged.glb';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.core.init();

	engine.files.load( testMapModel, (glb) => {

		glb.scene.traverse( (child) => {

			if ( child.isMesh ) {

				child.material = new engine.THREE.MeshNormalMaterial();

				engine.physics.setEnvironmentGeom( child.geometry );

				engine.core.scene.add( child );

			}
		
		});

	} );

	const playerCapsule = engine.physics.makePlayerCapsule( 0.25, 1 );

	playerCapsule.makeHelper( true );

	engine.cameraControls.orbitDynamicObj( playerCapsule );

	engine.characterControls.control( playerCapsule );

}

//

export default gamePage