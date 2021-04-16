
import { elem } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './mapEditor.css';
import bodies from './bodies.js';
import shapes from './shapes.js';

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

//

editorPage.start = function start() {

	engine.core.init( editorViewport );

	//

	const size = 10;
	const divisions = 10;

	const gridHelper = new engine.THREE.GridHelper( size, divisions );
	engine.core.scene.add( gridHelper );

	//

	const mesh = new engine.THREE.Mesh(
		new engine.THREE.BoxGeometry(),
		new engine.THREE.MeshNormalMaterial()
	);

	engine.core.scene.add( mesh );

	engine.cameraControls.orbitObj( mesh );

	//

	engine.core.listenClick( (intersects) => {

		console.log( 'intersects', intersects )

	} );

}

//

export default editorPage
