
import { elem } from '../../utils.js';

//

const gamePage = elem({ id:'game-page', classes: 'game-container' });

//

gamePage.start = function start() {

	engine.core.init( gamePage );

	//

	engine.levelManager.loadLevel( 'playground' );

	engine.on( 'gate', (e) => {

		const destinationLevel = e.detail;

		engine.levelManager.loadLevel( destinationLevel );

	} );

	engine.on( 'pause', () => {

		engine.levelManager.pause();

		setTimeout( () => {
			engine.levelManager.resume();
		}, 1000)

	} );

}

//

export default gamePage
