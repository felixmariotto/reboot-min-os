
import { elem } from '../../utils.js';
import './mapEditor.css';

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

editorPage.start = function start() {

	engine.core.init( editorViewport );

	const mesh = new engine.THREE.Mesh(
		new engine.THREE.BoxGeometry(),
		new engine.THREE.MeshNormalMaterial()
	);

	engine.core.scene.add( mesh );

	engine.cameraControls.orbitObj( mesh );

	engine.core.listenClick( (intersects) => {

		console.log( 'intersects', intersects )

	} );

}

//

export default editorPage
