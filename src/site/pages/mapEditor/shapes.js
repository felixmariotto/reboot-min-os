
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

	const box = new engine.THREE.Mesh(
		new engine.THREE.BoxGeometry(),
		new engine.THREE.MeshNormalMaterial()
	);

	box.isEditorShape = true;

	shapes.push( box );

	engine.core.scene.add( box );

	// create and dispatch the event
	const event = new CustomEvent( 'created-shape', { detail: box } );

	window.dispatchEvent( event );

}

function setAllUnselectedMaterial() {

	shapes.forEach( (shape) => {

		shape.material.wireframe = false;

	} );

}

function setSelectedMaterial( shape ) {

	console.log( shape )

	shape.material.wireframe = true;

}

//

export default {
	shapes,
	domOptions: shapesOptions,
	setAllUnselectedMaterial,
	setSelectedMaterial
}