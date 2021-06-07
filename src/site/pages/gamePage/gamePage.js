
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

	engine.levelManager.loadLevel( 'playground' );

	engine.on( 'gate', (e) => {

		const destinationLevel = e.detail;

		engine.levelManager.loadLevel( destinationLevel );

	} );

	engine.on( 'pointerlock-disabled', () => {

		engine.levelManager.pause();

		dialogue.start( engine.dialogues.intro );

		setTimeout( () => {
			dialogue.end()
		}, 1000 )

		// menu.show();

	} );

}

//

export default gamePage
