
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

		case 'meadow-tuto-point':
			switch ( gateName ) {
				case 'gate-01' :
					engine.levelManager.loadLevel( 'meadow-tuto-jump', [ 13.5, -0.5, -2.5 ], '+x' );
				break
			}
		break

		case 'meadow-tuto-jump':
			switch ( gateName ) {
				case 'gate-01' :
					engine.levelManager.loadLevel( 'meadow-hub', [ -12, 3.5, 21.5 ], '+z' );
				break
				case 'gate-02' :
					engine.levelManager.loadLevel( 'meadow-tuto-point', [ -14, -0.5, -6.5 ], '+x' );
				break
			}
		break

		case 'meadow-hub':
			switch ( gateName ) {
				case 'gate-01' :
					engine.levelManager.loadLevel( 'meadow-tuto-jump', [ -13.5, 2.5, 22.5 ], '+z' );
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
