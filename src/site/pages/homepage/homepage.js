
import './homepage.css';
import { elem } from '../../utils.js';

import characterTest from '../characterTest/characterTest.js';
import mapEditor from '../mapEditor/mapEditor.js';
import mapTest from '../mapTest/mapTest.js';

import backgroundImage from '../../../assets/background.png';

//

const homepage = elem({ id: 'homepage' });
homepage.style.backgroundImage = `url(${ backgroundImage })`;

const title = elem({ tagName: 'H1', html: 'Chain Dungeon Game' });

const gamePicking = elem({ id: 'homepage-picking-box', classes: 'hidden' });

gamePicking.append(
	makeGameButton( 'character test', characterTest ),
	makeGameButton( 'map editor', mapEditor ),
	makeGameButton( 'map file test', mapTest )
);

homepage.append(
	title,
	gamePicking
);

//

function makeGameButton( name, gamePage ) {

	const button = elem({ tagName: 'BUTTON', html:name });

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
