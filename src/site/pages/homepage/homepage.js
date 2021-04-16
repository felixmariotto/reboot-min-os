
import './homepage.css';
import { elem } from '../../utils.js';

import loadingBox from '../../components/loadingBox/loadingBox.js';

import mainGame from '../mainGame/mainGame.js';
import characterTest from '../characterTest/characterTest.js';
import mapTest from '../mapTest/mapTest.js';
import mapEditor from '../mapEditor/mapEditor.js';

//

const homepage = elem({ id: 'homepage' });

const title = elem({ tagName: 'H1', html: 'Game Title' });

const gamePicking = elem({ id: 'homepage-picking-box', classes: 'hidden truc' });

gamePicking.append(
	makeGameButton( 'main game', mainGame ),
	makeGameButton( 'character test', characterTest ),
	makeGameButton( 'map test', mapTest ),
	makeGameButton( 'map editor', mapEditor )
);

homepage.append(
	title,
	loadingBox,
	gamePicking
);

//

function makeGameButton( name, gamePage ) {

	const button = elem({ tagName: 'BUTTON', html:name });

	button.onclick = () => {

		document.body.append( gamePage );

		gamePage.start();

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
