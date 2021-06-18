
import core from '../core/core.js';
import events from '../misc/events.js';
import Playground from './Playground.js';

// Meadow
import MeadowHub from './meadow/Hub.js';
import MeadowTutoJump from './meadow/MeadowTutoJump.js';
import MeadowTutoPoint from './meadow/MeadowTutoPoint.js';

//

const levelManager = {
	loadLevel,
	pause,
	resume,
	restart,
	passGate
}

events.on( 'load-level', (e) => {

	levelManager.loadLevel( e.detail );

} );

export default levelManager

// playerMotionOrigin : "+x", "-x", etc...
// the direction from which we animate the character, to show the player were they came from.

function loadLevel( params ) {

	if ( this.currentLevel ) this.currentLevel.clear();

	this.currentLevel = ( () => {

		switch ( params.levelName ) {
			case 'playground': return Playground;
			case 'meadow-hub': return MeadowHub;
			case 'meadow-tuto-point': return MeadowTutoPoint;
			case 'meadow-tuto-jump': return MeadowTutoJump;
			default: console.error( 'not such level name: ', params.levelName );
		}

	} )();

	this.currentLevel = this.currentLevel( params );

}

/*

function loadLevel( levelName, playerInitPos, playerMotionOrigin, chainID ) {

	if ( this.currentLevel ) this.currentLevel.clear();

	//

	switch ( levelName ) {

		case 'playground':
			this.currentLevel = Playground( playerInitPos, playerMotionOrigin, chainID );
			break

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
*/

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

//

function passGate( gateName ) {

	this.currentLevel.passGate( gateName );

}
