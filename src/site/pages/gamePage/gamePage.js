
import { elem } from '../../utils.js';
import menu from '../../components/menu/menu.js';
import dialogue from '../../components/dialogue/dialogue.js';

//

const gamePage = elem({ id:'game-page', classes: 'game-container' });

//

gamePage.start = function start() {

	gamePage.append( menu, dialogue );

	engine.core.init( gamePage );

	//

	engine.levelManager.loadLevel( { levelName: 'meadow-tuto-point' } );

	setTimeout( () => {

		// dialogue.start( engine.dialogues.intro );

	}, 2000 );

	engine.on( 'item-collected', (e) => {

		const bodySerial = e.detail.serial;
		const bodyName = e.detail.name;
		const collectible = e.detail.collectible;

		console.log( collectible )

		if ( collectible.includes( 'gate' ) ) {

			engine.levelManager.passGate( collectible );

		} else {

			switch ( collectible ) {
				case 'dialogue-chain': dialogue.start( engine.dialogues.chain ); break
				case 'dialogue-jump': dialogue.start( engine.dialogues.jump ); break
			}

		}

	} );

	engine.on( 'pointerlock-disabled', () => {

		engine.levelManager.pause();

		menu.show();

	} );

}

//

export default gamePage
