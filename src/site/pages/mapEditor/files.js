
import './files.css';
import Button from '../../components/button/Button.js';
import { elem, icon } from '../../utils.js';

//

const filesOptions = elem({ id: 'editor-files-options', classes: 'tool-options' });

filesOptions.append(
	makeButton( 'save as JSON', saveAsJSON ),
	makeButton( 'import JSON', importJSON )
);

function makeButton( text, callback ) {

	const button = Button( text );

	button.onclick = callback;

	return button

}

//

function saveAsJSON() {

	console.log( 'save as JSON' );

}

function importJSON() {

	if ( window.confirm( 'Are you sure to import a scene and erase the current scene ?' ) ) {

		console.log( 'import JSON' );
		
	}

}

//

export default {
	domOptions: filesOptions
}
