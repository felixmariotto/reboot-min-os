
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './bodies.css';
import shapes from './shapes.js';

//

const bodies = [];

let selectedBody = null;

const bodiesOptions = elem({ classes: 'tool-options' });

//

const toolBar = elem({ id: 'editor-bodies-toolbar' });

bodiesOptions.append( toolBar );

//

toolBar.append(
	makeTool( 'far fa-plus-square', addBody ),
	makeTool( 'far fa-trash-alt', deleteBody ),
	makeTool( 'fas fa-file-import', addToBody ),
	makeTool( 'fas fa-file-export', removeFromBody ),
	makeTool( 'fas fa-lightbulb-on', showBody ),
	makeTool( 'far fa-lightbulb', hideBody ),
	makeTool( 'fas fa-pen-alt', nameBody ),
	makeTool( 'fas fa-code', setTransformFunction )
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

function selectBody( body ) {

	unselectedAll();

	body.domElement.classList.add( 'selected' );

	selectedBody = body;
}

function unselectedAll() {

	bodies.forEach( body => body.domElement.classList.remove( 'selected' ) );

	selectedBody = null;

}

function addBody() {

	const newBody = Body();

	bodies.push( newBody );

	bodiesList.append( newBody.domElement );

	newBody.domElement.onclick = () => { selectBody( newBody ) }

	selectBody( newBody );

}

function deleteBody() {

	if ( !selectedBody ) return

	if ( window.confirm( 'Are you sure to delete this body ?' ) ) {

		bodies.splice( bodies.indexOf( selectedBody ), 1 );

		selectedBody.clear();

		selectedBody = null;

	}

}

function addToBody() {

	const selectedShape = shapes.getSelected();

	console.log( selectedShape );

}

function removeFromBody() {

	console.log( 'remove from body' )

}

function showBody() {

	console.log( 'show body' );

}

function hideBody() {

	console.log( 'hide body' );

}

function nameBody() {

	console.log( 'name body' );

}

function setTransformFunction() {

	console.log( 'set transform function' );

}

//

function Body() {

	const name = ( Math.random() * 10000000 ).toFixed( 0 );

	function updateName( text ) {

		this.name = text;

	}

	function clear() {

		this.domElement.remove();

	}

	return {
		name,
		updateName,
		clear,
		domElement: elem({ classes: 'editor-body-line', html: name })
	}

}

//

export default {
	bodies,
	domOptions: bodiesOptions
}