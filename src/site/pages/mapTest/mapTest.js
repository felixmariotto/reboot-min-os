
import { elem } from '../../utils.js';

//

const gamePage = elem({ id:'map-test-page', classes: 'game-container' });

//

gamePage.start = function start() {

	engine.core.init( gamePage );

	engine.cameraControls.orbitObj( engine.core.scene );

	//

	engine.files.loadLocalMapFile( ( sceneGraph ) => {

		const params = engine.physics.World( sceneGraph );

		// engine.cameraControls.orbitDynamicObj( params.player );
		engine.cameraControls.orbitObj( engine.core.scene );
		// engine.characterControls.controlVelocity( params.player );

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

				case 'chain-extension-30' :
					params.player.chain.addLength( 30 );
				break

				case 'chain-extension-35' :
					params.player.chain.addLength( 35 );
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
