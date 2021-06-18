
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

// playerMotionOrigin : "+x", "-x", etc...
// the direction from which we animate the character, to show the player were they came from.

function loadLevel( levelName, playerInitPos, playerMotionOrigin, chainID ) {

	if ( this.currentLevel ) this.currentLevel.clear();

	//

	switch ( levelName ) {

		case 'playground':
			this.currentLevel = Playground( playerInitPos, playerMotionOrigin, chainID );
			break

		/* MEADOW */

		case 'meadow-hub':
			this.currentLevel = MeadowHub( playerInitPos, playerMotionOrigin, chainID );
			break

		case 'meadow-tuto-point':
			this.currentLevel = MeadowTutoPoint( playerInitPos, playerMotionOrigin, chainID );
			break

		case 'meadow-tuto-jump':
			this.currentLevel = MeadowTutoJump( playerInitPos, playerMotionOrigin, chainID );
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
