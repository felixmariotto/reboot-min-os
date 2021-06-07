
import './dialogue.css';
import { elem } from '../../utils.js';

//

const dialogueContainer = elem({ id: 'dialogue-container' });

//

dialogueContainer.start = function ( dialogueObj ) {

	console.log( 'dialogueObj', dialogueObj )

}

//

export default dialogueContainer
