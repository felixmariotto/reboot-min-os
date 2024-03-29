
import { elem } from '../../utils.js';

//

const gamePage = elem({ id:'map-test-page', classes: 'game-container' });

//

gamePage.start = function start() {

	engine.core.init( gamePage );

	//

	engine.files.loadLocalMapFile( ( sceneGraph ) => {

		const world = engine.physics.World( sceneGraph, true, true, true );

		engine.cameraControls.orbitWorldPlayer( world );
		engine.characterControls.controlVelocity( world );

		// react upon item collection

		engine.on( 'item-collected', (e) => {

			const data = e.detail;

			console.log('item-collected :', data )

			switch ( data.collectible ) {

				case 'chain-extension-5' :
					world.addChainLength( 5 );
				break

				case 'chain-extension-30' :
					world.addChainLength( 30 );
				break

				case 'chain-extension-35' :
					world.addChainLength( 35 );
				break

			}

		} );

		// react on switch state change

		engine.on( 'switch-change', (e) => {

			const data = e.detail;

			console.log( 'switch state changed : ', data );

		} );

	} );

}

//

export default gamePage
