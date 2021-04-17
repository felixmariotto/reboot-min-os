
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './shapes.css';

//

const shapes = [];

let selectedShape;

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

	const box = new engine.THREE.Mesh(
		new engine.THREE.BoxGeometry(),
		new engine.THREE.MeshNormalMaterial()
	);

	box.isEditorShape = true;

	shapes.push( box );

	engine.core.scene.add( box );

	selectShape( box );

}

function unselectAll() {

	shapes.forEach( (shape) => {

		shape.material.wireframe = false;

	} );

	selectedShape = null;

}

function selectShape( shape ) {

	unselectAll();

	shape.material.wireframe = true;

	selectedShape = shape;

	const event = new CustomEvent( 'transform-shape', { detail: shape } );

	window.dispatchEvent( event );

}

function getSelected() {

	return selectedShape;

}

//

export default {
	shapes,
	domOptions: shapesOptions,
	selectShape,
	getSelected
}