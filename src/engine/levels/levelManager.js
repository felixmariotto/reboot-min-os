
import core from '../core/core.js';
import events from '../misc/events.js';
import Playground from './Playground.js';

// Meadow
import MeadowHub from './meadow/Hub.js';
import MeadowTutoJump from './meadow/MeadowTutoJump.js';
import MeadowTutoPoint from './meadow/MeadowTutoPoint.js';
import MeadowFirstRoom from './meadow/MeadowFirstRoom.js';

//

const levelManager = {
	loadLevel,
	pause,
	resume,
	restart,
	passGate,
	addEnergy,
	collectedRewards: {
		energy: 0,
		reports: []
	},
	poweredBiomes: {
		meadow: false,
		canopy: false,
		darkForest: false,
		crypt: false
	}
}

events.on( 'load-level', (e) => {

	levelManager.loadLevel( e.detail );

} );

events.on( 'item-collected', (e) => {

	switch ( e.detail.collectible ) {
		case 'energy': levelManager.addEnergy(); break
		case 'dialogue-energy-meadow':
			levelManager.currentLevel.world.emitEvent( 'enable-body', 'dfofo' );
			// console.log('start dialogue + add meadow as poweredBiomes + remove door');
			break
	}

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
			case 'meadow-room-01': return MeadowFirstRoom;
			default: console.error( 'not such level name: ', params.levelName );
		}

	} )();

	this.currentLevel = this.currentLevel( params );

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

//

function passGate( gateName ) {

	this.currentLevel.passGate( gateName );

}

//

function addEnergy() {

	this.collectedRewards.energy ++;

}
