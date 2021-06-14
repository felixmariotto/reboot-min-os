
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

	engine.levelManager.loadLevel( 'meadow-hub' );

	engine.on( 'item-collected', (e) => {

		const bodySerial = e.detail.serial;
		const bodyName = e.detail.name;
		const collectible = e.detail.collectible;

		if ( collectible.includes( 'gate' ) ) {
			openFromGate( collectible );
		}

	} );

	engine.on( 'pointerlock-disabled', () => {

		engine.levelManager.pause();

		// dialogue.start( engine.dialogues.intro );

		menu.show();

	} );

}

//

function openFromGate( gateName ) {

	switch ( engine.levelManager.currentLevel.name ) {

		case 'meadow-hub':
			switch ( gateName ) {
				case 'gate-01' :
					engine.levelManager.loadLevel( 'meadow-tuto-jump' );
				break
			}
		break

		default:
			console.warn('current level name unknown')
		break

	}

}

//

export default gamePage
