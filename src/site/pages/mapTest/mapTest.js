
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

//

const gamePage = elem({ id:'map-test-page', classes: 'game-container' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.core.init( gamePage );

	engine.cameraControls.orbitObj( engine.core.scene );

	//

	engine.files.loadLocalMapFile( ( sceneGraph ) => {

		const world = engine.physics.WorldFromInfo( sceneGraph );

		world.traverse( (child) => {

			if ( child.makeHelper ) child.makeHelper();

		} );

		engine.core.scene.add( world );

	} );

}

//

export default gamePage