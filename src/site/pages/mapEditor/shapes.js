
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './shapes.css';

//

const shapes = [];

const shapesOptions = elem({ id: 'editor-shapes-options', classes: 'tool-options' });

//

const addShapeTools = elem({ id: 'editor-add-shape-toolbar' });

addShapeTools.append(
	makeShapeCreatorButton( 'fas fa-circle', createSphere ),
	makeShapeCreatorButton( 'far fa-cube', createBox )
);

function makeShapeCreatorButton( iconClasses, callback ) {

	const btnIcon = icon( iconClasses );

	const button = Button( btnIcon );

	button.onclick = callback;

	return button

}

//

shapesOptions.append(
	'Add a shape :',
	addShapeTools
);

//

function createSphere() {

	console.log('create a sphere');

}

function createBox() {

	console.log('create a box');

}

//

export default {
	shapes,
	domOptions: shapesOptions
}