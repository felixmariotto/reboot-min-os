
import core from '../core/core.js';
import Playground from './Playground.js';

// Meadow

import MeadowHub from './meadow/Hub.js';

//

let currentLevel;

export default {
	loadLevel,
	pause,
	resume,
	restart
}

//

function loadLevel( levelName ) {

	if ( currentLevel ) console.log('remove current level');

	//

	switch ( levelName ) {

		case 'playground':
			currentLevel = Playground();
			break

		case 'meadow-hub':
			currentLevel = MeadowHub();
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

//

function restart() {

	console.log('restart this level')

}
