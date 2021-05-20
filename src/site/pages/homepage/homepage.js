
import './homepage.css';
import { elem, icon } from '../../utils.js';

import gamePage from '../gamePage/gamePage.js';
import mapEditor from '../mapEditor/mapEditor.js';
import mapTest from '../mapTest/mapTest.js';

import backgroundImage from '../../../assets/background.png';

//

const homepage = elem({ id: 'homepage' });
homepage.style.backgroundImage = `url(${ backgroundImage })`;

const title = elem({ tagName: 'H1', html: 'Chain Dungeon Game' });

const gamePicking = elem({ id: 'homepage-picking-box', classes: 'hidden' });

gamePicking.append(
	makeGameButton( 'PLAY GAME', gamePage, 'fas fa-play-circle' ),
	makeGameButton( 'EDIT map', mapEditor, 'fas fa-edit' ),
	makeGameButton( 'TEST map', mapTest, 'fas fa-gamepad' )
);

homepage.append(
	title,
	gamePicking
);

//

function makeGameButton( name, gamePage, iconClass ) {

	const button = elem({ tagName: 'BUTTON', html: name });

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

	}

	return button

}

gamePicking.setInitState = function setInitState() {

	gamePicking.classList.remove( 'hidden' );

}

//

window.addEventListener( 'engine-loaded', () => {

	gamePicking.setInitState();

} );

//

export default homepage
