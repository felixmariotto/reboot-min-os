
import './dialogue.css';
import { elem } from '../../utils.js';

//

const dialogueContainer = elem({ id: 'dialogue-container' });

const dialogueFrame = elem({ id: 'dialogue-frame' });

dialogueContainer.append( dialogueFrame );

//

dialogueContainer.start = function ( dialogueObj ) {

	console.log( 'dialogueObj', dialogueObj )

	dialogueContainer.classList.add( 'active' );

}

dialogueContainer.end = function () {

	dialogueContainer.classList.remove( 'active' );

}

//

export default dialogueContainer
