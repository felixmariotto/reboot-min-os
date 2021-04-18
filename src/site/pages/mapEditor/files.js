
import './files.css';
import Button from '../../components/button/Button.js';
import { elem, icon } from '../../utils.js';

//

const filesOptions = elem({ id: 'editor-files-options', classes: 'tool-options' });

filesOptions.append(
	makeButton( 'save as JSON', emitSceneGraphRequest ),
	makeButton( 'import JSON', importJSON )
);

function makeButton( text, callback ) {

	const button = Button( text );

	button.onclick = callback;

	return button

}

//

function saveAsJSON( sceneGraph ) {

	const content = JSON.stringify( sceneGraph );
	const file = new Blob( [content], { type: 'text/plain' } );

	const a = document.createElement("a");
	a.href = URL.createObjectURL( file );
	a.download = 'game-map-' + new Date().toLocaleString() + '.txt'; // name of the file
	a.click();

}

function importJSON() {

	if ( window.confirm( 'Are you sure to import a scene and erase the current scene ?' ) ) {

		const input = document.createElement('INPUT');
		input.type = 'file';
		input.addEventListener('change', (e) => {

			const file = e.target.files[0];

    		file
    		.text()
    		.then( (text) => emitSceneData( JSON.parse( text ) ) );

		} );
		input.click();

	}

}

//

function emitSceneGraphRequest() {

	const event = new CustomEvent( 'scene-graph-request' );

	window.dispatchEvent( event );

}

function emitSceneData( sceneData ) {

	const event = new CustomEvent( 'scene-graph-loaded', { detail: sceneData } );

	window.dispatchEvent( event );

}

//

export default {
	domOptions: filesOptions,
	saveAsJSON
}
