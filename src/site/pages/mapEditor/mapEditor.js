
import { elem } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './mapEditor.css';
import bodies from './bodies.js';
import shapes from './shapes.js';

//

let transformControl;

const toolModules = [ bodies, shapes ];

//

const editorPage = elem({ id:'editor-page', classes: 'game-container' });

//

const leftContainer = elem({ id: 'editor-left-panel' });
const rightContainer = elem({ id: 'editor-right-panel' });

editorPage.append( leftContainer, rightContainer );

//

const editorConsole = elem({ id: 'editor-console', classes: 'ui-panel' });
const editorViewport = elem({ id: 'editor-viewport', classes: 'ui-panel' });

leftContainer.append( editorConsole, editorViewport );

//

const tools = elem({ id: 'editor-tools', classes: 'ui-panel' });
const toolsOptions = elem({ id: 'editor-tools-options', classes: 'ui-panel' });

rightContainer.append( tools, toolsOptions );

//

tools.append(
	makeToolButton( 'bodies', bodies ),
	makeToolButton( 'shapes', shapes ),
);

function makeToolButton( name, toolModule ) {

	const button = Button( name );

	button.onclick = () => {

		if ( !toolModule.isEnabled ) {

			hideAllTools();

			toolModule.isEnabled = true;

			toolModule.domOptions.style.display = 'inherit';

		}

	}

	return button

}

function hideAllTools() {

	toolModules.forEach( tool => {

		tool.domOptions.style.display = 'none'

		tool.isEnabled = false;

	} );

}

//

toolsOptions.append(
	bodies.domOptions,
	shapes.domOptions
);

// SHAPES

let selectedShape = null;

function selectShape( shape ) {

	selectedShape = shape;

	shapes.setAllUnselectedMaterial();

	shapes.setSelectedMaterial( selectedShape );

	transformControl.attach( shape );

}

window.addEventListener( 'created-shape', (e) => {

	selectShape( e.detail );

} );

//  EVENT LISTENERS

window.addEventListener( 'keydown', (e) => {

	switch ( e.keyCode ) {

		case 83 : switchTransformMode();

	}

} );

// TRANSFORM CONTROLS

const transformModes = [ 'translate', 'rotate', 'scale' ];
let transformMode = 0;

function switchTransformMode() {

	if ( !transformControl ) return

	transformMode = ( transformMode + 1 ) % 3;

	transformControl.setMode( transformModes[ transformMode ] );

}

// INITIALIZATION

editorPage.start = function start() {

	engine.core.init( editorViewport );

	transformControl = new engine.TransformControls( engine.core.camera, editorViewport );
	transformControl.setSpace( 'local' );

	engine.core.scene.add( transformControl );

	// GRID

	const size = 50;
	const divisions = 50;

	const gridHelper = new engine.THREE.GridHelper( size, divisions );
	const axesHelper = new engine.THREE.AxesHelper( size / 2 );

	engine.core.scene.add( gridHelper, axesHelper );

	//

	const orbitControls = engine.cameraControls.orbitObj( engine.core.scene );

	transformControl.addEventListener( 'mouseDown', () => orbitControls.enabled = false );

	transformControl.addEventListener( 'mouseUp', () => orbitControls.enabled = true );

	//

	engine.core.listenClick( (intersects) => {

		const a = intersects.find( intersect => intersect.object.isEditorShape );

		if ( a ) selectShape( a.object );

	} );

}

//

export default editorPage
