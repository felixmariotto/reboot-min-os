
import './homepage.css';
import { elem } from '../../utils.js';

import loadingBox from '../../components/loadingBox/loadingBox.js';

import mainGame from '../mainGame/mainGame.js';
import characterTest from '../characterTest/characterTest.js';

//

const homepage = elem({ id: 'homepage' });

const title = elem({ tagName: 'H1', html: 'Game Title' });

const gamePicking = elem({ id: 'homepage-picking-box', classes: 'hidden truc' });

gamePicking.append(
	makeGameButton( 'main game', mainGame ),
	makeGameButton( 'character test', characterTest)
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
