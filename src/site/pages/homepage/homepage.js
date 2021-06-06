
import './homepage.css';
import { elem, icon } from '../../utils.js';

import List from '../../components/list/List.js';
import Button from '../../components/button/Button.js';

import gamePage from '../gamePage/gamePage.js';
import mapEditor from '../mapEditor/mapEditor.js';
import mapTest from '../mapTest/mapTest.js';

import backgroundImage from '../../../assets/background.png';

//

const homepage = elem({ id: 'homepage' });
homepage.style.backgroundImage = `url(${ backgroundImage })`;

const title = elem({ tagName: 'H1', html: 'Chain Dungeon Game' });

const gamesList = List();
gamesList.id = 'homepage-picking-box';
gamesList.classList.add( 'hidden' );

const intervalToken = setInterval( enableGamesList, 50 );

function enableGamesList() {

	if ( window.engine ) {

		clearInterval( intervalToken );

		gamesList.enable();

	}

}

// const gamesList = elem({ id: 'homepage-picking-box', classes: 'hidden' });

gamesList.append(
	makeGameButton( 'PLAY GAME', gamePage, 'fas fa-play-circle' ),
	makeGameButton( 'EDIT map', mapEditor, 'fas fa-edit' ),
	makeGameButton( 'TEST map', mapTest, 'fas fa-gamepad' )
);

homepage.append(
	title,
	gamesList
);

//

function makeGameButton( name, gamePage, iconClass ) {

	const button = Button( name );

	if ( iconClass ) {
		const x = icon( iconClass );
		x.style.fontSize = "1.5em";
		button.prepend( ' ' );
		button.prepend( x );
	}

	button.onclick = () => {

		document.body.append( gamePage );

		gamePage.start();

		button.blur();

		gamesList.disable();

	}

	return button

}

gamesList.setInitState = function setInitState() {

	gamesList.classList.remove( 'hidden' );

}

//

window.addEventListener( 'engine-loaded', () => {

	gamesList.setInitState();

} );

//

export default homepage
