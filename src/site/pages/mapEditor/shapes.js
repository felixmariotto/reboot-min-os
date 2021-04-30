
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './shapes.css';
import editorConsole from './editorConsole.js';

//

const shapes = [];

let selectedMaterials = [];
let selectedShapes = [];

setTimeout( () => {

	engine.core.callInLoop( () => {

		if ( selectedMaterials.length ) {

			const scale = Math.sin( Date.now() / 100 ) * 0.2 + 0.2;

			selectedMaterials.forEach( (material) => {

				material.emissive.setScalar( scale );

			} );

		}

	} );

}, 500 );

const shapesOptions = elem({ id: 'editor-shapes-options', classes: 'tool-options' });

//

const addShapeTools = elem({ id: 'editor-add-shape-toolbar' });

addShapeTools.append(
	makeShapeCreatorButton( 'fas fa-circle', createSphere ),
	makeShapeCreatorButton( 'far fa-cube', createBox ),
	makeShapeCreatorButton( 'fal fa-ring', createCylinder )
);

shapesOptions.append(
	'Add a shape :',
	addShapeTools
);

function makeShapeCreatorButton( iconClasses, callback ) {

	const btnIcon = icon( iconClasses );

	const button = Button( btnIcon );

	button.onclick = callback;

	return button

}

//

function createShape( shapeType ) {

	unselectAll();

	const geometry = ( () => {

		switch ( shapeType ) {

			case 'sphere' : return new engine.THREE.IcosahedronGeometry( 1, 3 )
			case 'cylinder': return new engine.THREE.CylinderGeometry( 1, 1, 1, 16 )
			default : return new engine.THREE.BoxGeometry()

		}

	} )();

	const shape = new engine.THREE.Mesh( geometry, DefaultShapeMaterial() );

	shape.isEditorShape = true;

	shape.shapeType = shapeType;

	shapes.push( shape );

	engine.core.scene.add( shape );

	selectShape( shape );

	shape.getInfo = function getInfo() {

		switch ( shapeType ) {

			case 'box':
				return {
					pos: shape.position,
					rot: shape.rotation,
					width: shape.scale.x,
					height: shape.scale.y,
					depth: shape.scale.z,
					type: 'box'
				}

			case 'sphere':
				return {
					pos: shape.position,
					radius: shape.scale.x,
					type: 'sphere'
				}

			case 'cylinder':
				return {
					pos: shape.position,
					rot: shape.rotation,
					radius: shape.scale.x,
					height: shape.scale.y,
					type: 'cylinder'
				}

		}

	}

	return shape

}

function createSphere() { createShape( 'sphere' ) }
function createCylinder() { createShape( 'cylinder' ) }
function createBox() { createShape( 'box' ) }

//

function unselectAll() {

	if ( !selectedShapes.length ) return

	selectedMaterials.forEach( material => material.emissive.setScalar( 0 ) );

	selectedMaterials = [];
	selectedShapes = [];

	const event = new CustomEvent( 'end-transform' );

	window.dispatchEvent( event );

}

window.addEventListener( 'keydown', (e) => {

	if ( e.code === "Escape" ) unselectAll();
	else if ( e.code === "Delete" ) deleteSelected();

} );

//

function deleteSelected() {

	if ( selectedShapes.length ) {

		const shapes = selectedShapes.slice(0);

		unselectAll();

		shapes.forEach( (shape) => {

			shape.parent.remove( shape );
			shape.material.dispose();
			shape.geometry.dispose();

		} );

		editorConsole.log( 'Shapes deleted' );

	} else {

		editorConsole.warn( 'No shape is selected, nothing to delete' );

	}

}

function selectShape( shape ) {

	selectedMaterials.push( shape.material );
	selectedShapes.push( shape );

	const event = new CustomEvent( 'transform-shape', { detail: selectedShapes } );

	window.dispatchEvent( event );

}

function getSelected() {

	return selectedShapes;

}

function fromInfo( info ) {

	if ( !info ) debugger

	const shape = createShape( info.type );

	switch ( info.type ) {

		case 'box' :
			shape.scale.set(
				info.width,
				info.height,
				info.depth
			);
			break

		case 'sphere' :
			shape.scale.setScalar( info.radius );
			break

		case 'cylinder' :
			shape.scale.set(
				info.radius,
				info.height,
				info.radius
			);
			break

	}

	if ( info.rot ) shape.rotation.copy( info.rot );
	if ( info.pos ) shape.position.copy( info.pos );

	unselectAll();

	return shape

}

//

function duplicateSelected() {

	if ( selectedShapes.length ) {

		const newShapes = [];

		selectedShapes.forEach( (shape) => {

			const newShape = fromInfo( shape.getInfo() );

			newShapes.push( newShape );

		} );

		newShapes.forEach( shape => selectShape( shape ) );

		editorConsole.log( 'duplicated shapes')

	} else {

		editorConsole.warn( 'no shape selected, impossible to duplicate.' )

	}

}

//

function DefaultShapeMaterial() {

	return new engine.THREE.MeshPhongMaterial({ color: 0x555555 });

}

//

export default {
	shapes,
	domOptions: shapesOptions,
	selectShape,
	getSelected,
	fromInfo,
	duplicateSelected,
	DefaultShapeMaterial
}
