
import './homepage.css';
import { elem, icon } from '../../utils.js';

import List from '../../components/list/List.js';
import Button from '../../components/button/Button.js';

import gamePage from '../gamePage/gamePage.js';
import mapEditor from '../mapEditor/mapEditor.js';
import mapTest from '../mapTest/mapTest.js';

import starrySkyImage from '../../../assets/images/starry-sky.jpg';
import crashedShipImage from '../../../assets/images/homepage-background.jpg';

//

const homepage = elem({ id: 'homepage' });
homepage.style.backgroundImage = `url(${ starrySkyImage })`;
const homepageBack = elem({ id: 'homepage-background' });
homepageBack.style.backgroundImage = `url(${ crashedShipImage })`;

// parallax in the home screen, to be remove on button click.
window.addEventListener( 'mousemove', handleMouseMove );
function handleMouseMove(e) {
	const ratio = ( e.x / window.innerWidth ) * -1 + 0.5;
	homepageBack.style.transform = `translateX(${ ratio * 10 }vw)`;
	homepage.style.backgroundPosition = ( ( ratio * -1 + 5 ) * 12 ) + '%';
}

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
	homepageBack,
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

		window.removeEventListener( 'mousemove', handleMouseMove );

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
