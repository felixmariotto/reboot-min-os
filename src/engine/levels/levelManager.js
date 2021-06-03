
import Playground from './Playground.js';

//

let currentLevel;

export default {
	loadLevel,
	pause,
	resume
}

//

function loadLevel( levelName ) {

	if ( currentLevel ) console.log('remove current level');

	//

	switch ( levelName ) {

		case 'playground':
			currentLevel = Playground();
			break

		default :
			console.warn('level name unknown')
			break

	}

}

//

function pause() {

	if ( currentLevel && currentLevel.world ) {

		currentLevel.world.pause();

	}

}

//

function resume() {

	if ( currentLevel && currentLevel.world ) {

		currentLevel.world.resume();

	}

}
