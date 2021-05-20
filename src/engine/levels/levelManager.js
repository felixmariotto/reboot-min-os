
import Playground from './Playground.js';

//

let currentLevel;

export default {
	loadLevel
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