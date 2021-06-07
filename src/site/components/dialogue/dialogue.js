
import './dialogue.css';
import { elem } from '../../utils.js';

//

const dialogueContainer = elem({ id: 'dialogue-container' });
const dialogueFrame = elem({ id: 'dialogue-frame' });
const thumbnail = elem({ id: 'dialogue-thumbnail' });
const textContent = elem({ id: 'dialogue-text' });

dialogueContainer.append( dialogueFrame );
dialogueFrame.append( thumbnail, textContent );

//

let currentStory, currentLine, currentChar;

function setTemplate( template ) {

	console.log( 'set template', template );

}

function readStory( story ) {

	currentStory = story;
	currentLine = 0;
	currentChar = 0;

	console.log( 'story', story );

}

//

let isLoopOn = false;

function startLoop() {

	isLoopOn = true;

	loop();

}

function endLoop() { isLoopOn = false }

function loop() {

	if ( isLoopOn ) setTimeout( loop, 50 )

	if ( currentStory ) {

		const line = currentStory[ currentLine ];

		if ( currentChar > line.m.length - 1 ) {

			// show arrow
			// and listen for event

		} else {

			// print the current character

			textContent.append( line.m[ currentChar ] );

			// will print the next character on next loop call.

			currentChar ++;

		}

	}

}

//

dialogueContainer.start = function ( dialogueObj ) {

	startLoop();

	setTemplate( dialogueObj.template );

	readStory( dialogueObj.story );

	dialogueContainer.classList.add( 'active' );

}

dialogueContainer.end = function () {

	endLoop();

	dialogueContainer.classList.remove( 'active' );

}

//

export default dialogueContainer
