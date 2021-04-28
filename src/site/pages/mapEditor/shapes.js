
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './shapes.css';
import editorConsole from './editorConsole.js';

//

const shapes = [];

let selectedShape, selectedMaterial;

setTimeout( () => {

	engine.core.callInLoop( () => {

		if ( selectedMaterial ) {

			const scale = Math.sin( Date.now() / 100 ) * 0.2 + 0.2;

			selectedMaterial.emissive.setScalar( scale );

		}

	} );

}, 500 );

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
		new engine.THREE.MeshPhongMaterial({ color: 0x555555 })
	);

	box.isEditorShape = true;

	box.shapeType = 'box';

	shapes.push( box );

	engine.core.scene.add( box );

	selectShape( box );

}

function unselectAll() {

	if ( !selectedShape ) return

	if ( selectedMaterial ) selectedMaterial.emissive.setScalar( 0 );
	selectedMaterial = null;
	selectedShape = null;

	const event = new CustomEvent( 'end-transform' );

	window.dispatchEvent( event );

}

window.addEventListener( 'keydown', (e) => {

	if ( e.code === "Escape" ) unselectAll();
	else if ( e.code === "Delete" ) deleteSelected();

} );

//

function deleteSelected() {

	if ( selectedShape ) {

		const shape = selectedShape;

		unselectAll();

		shape.parent.remove( shape );
		shape.material.dispose();
		shape.geometry.dispose();

		editorConsole.log( 'Shape deleted' );

	} else {

		editorConsole.warn( 'No shape is selected, nothing to delete' );

	}

}

function selectShape( shape ) {

	unselectAll();

	selectedMaterial = shape.material;

	selectedShape = shape;

	const event = new CustomEvent( 'transform-shape', { detail: shape } );

	window.dispatchEvent( event );

}

function getSelected() {

	return selectedShape;

}

function fromInfo( info ) {

	switch ( info.type ) {

		case 'box' :

			const box = new engine.THREE.Mesh(
				new engine.THREE.BoxGeometry(),
				new engine.THREE.MeshPhongMaterial({ color: 0x555555 })
			);

			box.rotation.copy( info.rot );
			box.position.copy( info.pos );
			box.scale.set(
				info.width,
				info.height,
				info.depth
			);

			box.isEditorShape = true;

			box.shapeType = 'box';

			shapes.push( box );

			engine.core.scene.add( box );

			return box

	}

}

//

function duplicateSelected() {

	if ( selectedShape ) {

		let info;

		switch ( selectedShape.shapeType ) {

			case 'box':
				info = {
					pos: selectedShape.position,
					rot: selectedShape.rotation,
					width: selectedShape.scale.x,
					height: selectedShape.scale.y,
					depth: selectedShape.scale.z,
					type: 'box'
				}
			break

		}

		const newShape = fromInfo( info );

		selectShape( newShape );

	} else {

		editorConsole.warn( 'no shape selected, impossible to duplicate.' )

	}

}

//

export default {
	shapes,
	domOptions: shapesOptions,
	selectShape,
	getSelected,
	fromInfo,
	duplicateSelected
}