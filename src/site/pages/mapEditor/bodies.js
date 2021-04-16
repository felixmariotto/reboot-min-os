
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './bodies.css';

//

const bodies = [];

const bodiesOptions = elem({ classes: 'tool-options' });

//

const toolBar = elem({ id: 'editor-bodies-toolbar' });

bodiesOptions.append( toolBar );

//

toolBar.append(
	makeTool( 'far fa-plus-square', addBody ),
	makeTool( 'far fa-trash-alt', deleteBody ),
	makeTool( 'fas fa-file-import', addToBody ),
	makeTool( 'fas fa-file-export', removeFromBody )
);

function makeTool( iconClasses, callback ) {

	const toolIcon = icon( iconClasses );

	const button = Button( toolIcon );

	button.onclick = callback;

	return button

}

//

const listContainer = elem({ id: 'editor-bodies-list-container' })
const bodiesList = elem({ id: 'editor-bodies-list' });


bodiesOptions.append( listContainer );
listContainer.append( bodiesList );

//

function addBody() {

	const newBody = Body();

	bodies.push( newBody );

	bodiesList.append( newBody.domElement );

}

function deleteBody() {

	console.log( 'delete body' )

}

function addToBody() {

	console.log( 'add to body' )

}

function removeFromBody() {

	console.log( 'remove from body' )

}

//

function Body() {

	function updateName( text ) {
		this.name = text
	}

	return {
		updateName,
		domElement: elem({ classes: 'editor-body-line' })
	}

}

//

export default {
	bodies,
	domOptions: bodiesOptions
}