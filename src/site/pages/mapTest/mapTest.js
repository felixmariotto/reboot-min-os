
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

		engine.cameraControls.orbitDynamicObj( params.player );
		// engine.cameraControls.orbitObj( engine.core.scene );
		engine.characterControls.controlVelocity( params.player );

		// react upon item collection

		engine.on( 'item-collected', (e) => {

			const body = e.detail;

			const itemType = body.tags.collectible;

			if ( body.tags.collected ) return

			body.tags.collected = true;

			switch ( itemType ) {

				case 'chain-extension-5' :
					params.player.chain.addLength( 5 );
				break

			}

		} );

	} );

}

//

export default gamePage
