
import core from '../core/core.js';
import Playground from './Playground.js';

// Meadow
import MeadowHub from './meadow/Hub.js';
import MeadowTutoJump from './meadow/MeadowTutoJump.js';
import MeadowTutoPoint from './meadow/MeadowTutoPoint.js';

//

export default {
	loadLevel,
	pause,
	resume,
	restart
}

//

function loadLevel( levelName ) {

	if ( this.currentLevel ) this.currentLevel.clear();

	//

	switch ( levelName ) {

		case 'playground':
			this.currentLevel = Playground();
			break

		/* MEADOW */

		case 'meadow-hub':
			this.currentLevel = MeadowHub();
			break

		case 'meadow-tuto-point':
			this.currentLevel = MeadowTutoPoint();
			break

		case 'meadow-tuto-jump':
			this.currentLevel = MeadowTutoJump();
			break

		default :
			console.warn('level name unknown')
			break

	}

}

//

function pause() {

	if ( this.currentLevel && this.currentLevel.world ) {

		this.currentLevel.world.pause();

	}

}

//

function resume() {

	if ( this.currentLevel && this.currentLevel.world ) {

		this.currentLevel.world.resume();

	}

}

//

function restart() {

	console.log('restart this level')

}
