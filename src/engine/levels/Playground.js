
import files from '../files/files.js';
import Level from './Level.js';

//

export default function Playground() {

	const level = Object.assign(
		Level(),
		{
			mapFile: files.maps.playground
		}
	);

	//

	level.start();

	//

	return level

};

/*
engine.files.loadLocalMapFile( ( sceneGraph ) => {

		const world = engine.physics.World( sceneGraph );

		engine.cameraControls.orbitDynamicObj( world.player );
		// engine.cameraControls.orbitObj( world.player );

		engine.characterControls.controlVelocity( world );

		// react upon item collection

		engine.on( 'item-collected', (e) => {

			const data = e.detail;

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
	*/