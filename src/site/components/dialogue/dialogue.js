
import './dialogue.css';
import { elem, icon } from '../../utils.js';

//

const dialogueContainer = elem({ id: 'dialogue-container' });
const dialogueFrame = elem({ id: 'dialogue-frame' });
const thumbnail = elem({ id: 'dialogue-thumbnail' });
const textContent = elem({ id: 'dialogue-text' });
const arrow = icon( 'fas fa-caret-down' );

dialogueContainer.append( dialogueFrame );
dialogueFrame.append( thumbnail, textContent );
textContent.append( arrow )

//

let currentStory, currentLine, currentChar, started, listeningNext;

function readStory( story ) {

	currentStory = story;
	currentLine = 0;
	currentChar = 0;

}

function nextLine() {

	currentLine ++;
	currentChar = 0;

	if ( currentLine > currentStory.length - 1 ) {

		currentLine = 0;
		endLoop();

		// Failure to enable pointerlock happen very easily in Chrome.
		// See : https://bugs.chromium.org/p/chromium/issues/detail?id=1127223
		engine.core.makeSurePointerLock()
		.then( (resp) => {
			if ( resp === 'success' ) {

				dialogueContainer.end();
				textContent.innerHTML = '';
				textContent.append( arrow );

			}
		} )
		.catch( err => console.log(err) );

	} else {

		textContent.innerHTML = '';
		textContent.append( arrow );

	}

}

//

let isLoopOn = false;

function startLoop() {

	isLoopOn = true;

	loop();

}

function endLoop() { isLoopOn = false }

function loop() {

	if ( isLoopOn ) setTimeout( loop, 30 );

	if ( isLoopOn && currentStory ) {

		const line = currentStory[ currentLine ];

		if ( currentChar > line.m.length - 1 ) {

			// show arrow
			// and listen for event

			listeningNext = true;

		} else {

			listeningNext = false;

			// print the current character

			textContent.append( line.m[ currentChar ] );

			// will print the next character on next loop call.

			currentChar ++;

		}

	}

}

//

dialogueContainer.start = function ( dialogueObj ) {

	if ( !started ) {

		engine.on( 'jump-key-down', () => {

			if ( listeningNext ) nextLine();

		} );

		engine.on( 'pull-key-down', () => {

			if ( listeningNext ) nextLine();

		} );

		engine.on( 'release-key-down', () => {

			if ( listeningNext ) nextLine();

		} );

		started = true;

	}

	readStory( dialogueObj.story );

	startLoop();

	dialogueContainer.classList.add( 'active', dialogueObj.template );

}

dialogueContainer.end = function () {

	endLoop();

	dialogueContainer.classList.remove( 'active' );

	engine.levelManager.resume();

}

//

export default dialogueContainer
