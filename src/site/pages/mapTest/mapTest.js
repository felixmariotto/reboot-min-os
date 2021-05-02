
import { elem } from '../../utils.js';

//

const gamePage = elem({ id:'map-test-page', classes: 'game-container' });

//

gamePage.start = function start() {

	engine.core.init( gamePage );

	engine.cameraControls.orbitObj( engine.core.scene );

	//

	engine.files.loadLocalMapFile( ( sceneGraph ) => {

		const params = engine.physics.WorldFromInfo( sceneGraph );

		// engine.cameraControls.orbitDynamicObj( params.player );
		engine.cameraControls.orbitObj( engine.core.scene );
		engine.characterControls.controlVelocity( params.player );

	} );

}

//

export default gamePage
