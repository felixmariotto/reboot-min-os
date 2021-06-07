
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

function setTemplate( template ) {

	console.log( 'set template', template );

}

function readStory( story ) {

	console.log( 'story', story );

}

//

dialogueContainer.start = function ( dialogueObj ) {

	setTemplate( dialogueObj.template );

	readStory( dialogueObj.story );

	dialogueContainer.classList.add( 'active' );

}

dialogueContainer.end = function () {

	dialogueContainer.classList.remove( 'active' );

}

//

export default dialogueContainer
