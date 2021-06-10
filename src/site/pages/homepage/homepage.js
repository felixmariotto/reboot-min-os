
import './homepage.css';
import { elem, icon } from '../../utils.js';

import List from '../../components/list/List.js';
import Button from '../../components/button/Button.js';

import gamePage from '../gamePage/gamePage.js';
import mapEditor from '../mapEditor/mapEditor.js';
import mapTest from '../mapTest/mapTest.js';

import starrySkyImage from '../../../assets/images/starry-sky.jpg';
import crashedShipImage from '../../../assets/images/homepage-background.jpg';
import logoImage from '../../../assets/images/logo.svg';

//

const homepage = elem({ id: 'homepage' });
homepage.style.backgroundImage = `url(${ starrySkyImage })`;
const homepageBack = elem({ id: 'homepage-background' });
homepageBack.style.backgroundImage = `url(${ crashedShipImage })`;

// parallax in the home screen, to be remove on button click.

let mustStopBackgroundLoop;
let lastTopPos = 0;
let lastBackPos = 60;
let targetTopPos, targetBackPos;

window.addEventListener( 'mousemove', handleMouseMove );

function handleMouseMove(e) {
	const ratio = ( e.x / window.innerWidth ) * -1 + 0.5;
	targetTopPos = ratio * 8;
	targetBackPos = ( ( ratio * -1 + 5 ) * 12 );
}

backgroundLoop();
function backgroundLoop() {
	if ( !mustStopBackgroundLoop ) {
		if ( targetTopPos ) {
			const newTopPos = lastTopPos + ( ( targetTopPos - lastTopPos ) * 0.1 );
			homepageBack.style.transform = `translateX( calc( -50% + ${ newTopPos }% ) )`;
			lastTopPos = newTopPos;
		}
		if ( targetBackPos ) {
			const newBackPos = lastBackPos + ( ( targetBackPos - lastBackPos ) * 0.1 );
			homepage.style.backgroundPosition = newBackPos + '%';
			lastBackPos = newBackPos;
		}
		requestAnimationFrame( backgroundLoop );
	}
}

//

const title = elem({ id: 'title-image', tagName: 'IMG' });
title.src = logoImage;

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

		mustStopBackgroundLoop = true;

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
