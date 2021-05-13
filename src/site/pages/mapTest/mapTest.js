
import { elem } from '../../utils.js';

//

const gamePage = elem({ id:'map-test-page', classes: 'game-container' });

//

gamePage.start = function start() {

	engine.core.init( gamePage );

	//

	engine.files.loadLocalMapFile( ( sceneGraph ) => {

		const world = engine.physics.World( sceneGraph );

		// engine.cameraControls.orbitDynamicObj( world.player );
		engine.cameraControls.orbitObj( world.player );
		// engine.characterControls.controlVelocity( world.player );

		engine.characterControls.controlVelocity( world );

		// react upon item collection

		engine.on( 'item-collected', (e) => {

			const body = e.detail;

			const itemType = body.tags.collectible;

			if ( body.tags.collected ) return

			body.tags.collected = true;

			switch ( itemType ) {

				case 'chain-extension-5' :
					world.player.chain.addLength( 5 );
				break

				case 'chain-extension-30' :
					world.player.chain.addLength( 30 );
				break

				case 'chain-extension-35' :
					world.player.chain.addLength( 35 );
				break

			}

		} );

		// react on switch state change

		engine.on( 'switch-change', (e) => {

			const body = e.detail;

			console.log( 'switch state changed : ', body.tags.switchState )

		} );

	} );

}

//

export default gamePage
