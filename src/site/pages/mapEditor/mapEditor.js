
import { elem } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './mapEditor.css';
import editorConsole from './editorConsole.js';
import bodies from './bodies.js';
import shapes from './shapes.js';
import files from './files.js';
import chain from './chain.js';
import chainPoints from './chainPoints.js';
import hero from './hero.js';

//

let transformControl, heroHelper, chainHelper, chainStartBody;

const toolModules = [ bodies, shapes, files, chainPoints, chain, hero ];

//

const editorPage = elem({ id:'editor-page', classes: 'game-container' });

//

const leftContainer = elem({ id: 'editor-left-panel' });
const rightContainer = elem({ id: 'editor-right-panel' });

editorPage.append( leftContainer, rightContainer );

//

const editorViewport = elem({ id: 'editor-viewport', classes: 'ui-panel' });

leftContainer.append( editorConsole, editorViewport );

//

const tools = elem({ id: 'editor-tools', classes: 'ui-panel' });
const toolsOptions = elem({ id: 'editor-tools-options', classes: 'ui-panel' });

rightContainer.append( tools, toolsOptions );

//

tools.append(
	makeToolButton( 'files', files ),
	'//',
	makeToolButton( 'bodies', bodies ),
	makeToolButton( 'shapes', shapes ),
	'//',
	makeToolButton( 'chain points', chainPoints ),
	makeToolButton( 'chain', chain ),
	makeToolButton( 'hero', hero )
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
	shapes.domOptions,
	files.domOptions,
	chainPoints.domOptions,
	chain.domOptions,
	hero.domOptions
);

//  EVENT LISTENERS

let isShiftPressed = false;

window.addEventListener( 'keydown', (e) => {

	switch ( e.keyCode ) {

		case 83 : switchTransformMode(); break
		case 68 : if ( isShiftPressed ) shapes.duplicateSelected(); break
		case 16 : isShiftPressed = true; break

	}

} );

window.addEventListener( 'keyup', (e) => {

	switch ( e.keyCode ) {

		case 16 : isShiftPressed = false; break

	}

} );

window.addEventListener( 'scene-graph-request', () => {

	const sceneInfo = {
		chain: chain.getParams(),
		chainPoints: chainPoints.getParams(),
		hero: hero.getPosition()
	}

	sceneInfo.bodies = bodies.bodies.map( (body) => {

		const parsedBody = {
			name: body.name,
			trans: body.transformCode,
			color: body.color,
			tags: body.tags
		};

		parsedBody.shapes = body.threeObj.children
		.filter( child => child.shapeType ) // trim out chain point helpers
		.map( (shape) => {

			switch ( shape.shapeType ) {

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

		} );

		return parsedBody

	} );

	files.saveAsJSON( sceneInfo );

} );

window.addEventListener( 'scene-graph-loaded', (e) => {

	try {

		const info = e.detail;

		// clear old project

		engine.core.scene.traverse( (child) => {

			if ( child.shapeType || child.isBody ) {

				child.material.dispose();
				child.geometry.dispose();

			}

		} );

		engine.core.scene.clear();

		engine.core.scene.add( transformControl, heroHelper, chainHelper );

		makeGrid();

		addLights();

		// copy file params in project

		info.bodies.forEach( (bodyInfo) => {

			bodies.fromInfo( bodyInfo );

		} );

		chainPoints.fromInfo( info.chainPoints );

		chain.fromInfo( info.chain );

		hero.fromInfo( info.hero );

		//

		if ( chainHelper ) chainHelper.updateHelper( chain.getParams() );

		//

		editorConsole.log( 'a scene has been successfully imported')

	} catch ( err ) {

		editorConsole.error( err );
		console.log( err );

	}

} );

window.addEventListener( 'update-hero', (e) => {

	heroHelper.position.copy( e.detail );

	chainHelper.updateHelper( chain.getParams() );

} );

window.addEventListener( 'update-chain', (e) => {

	chainHelper.updateHelper( e.detail );

} );

// TRANSFORM CONTROLS

const transformModes = [ 'translate', 'rotate', 'scale' ];
let transformMode = 0;

function switchTransformMode() {

	if ( !transformControl ) return

	transformMode = ( transformMode + 1 ) % 3;

	transformControl.setMode( transformModes[ transformMode ] );

}

window.addEventListener( 'transform-shape', (e) => {

	transformControl.attach( e.detail );

} );

window.addEventListener( 'end-transform', () => {

	transformControl.detach();

} );

// INITIALIZATION

editorPage.start = function start() {

	try {

		const _vec0 = new engine.THREE.Vector3();
		const _vec1 = new engine.THREE.Vector3();

		//

		engine.core.init( editorViewport );

		addLights();

		//

		transformControl = new engine.TransformControls( engine.core.camera, editorViewport );
		transformControl.setSpace( 'local' );

		heroHelper = new engine.THREE.Mesh(
			new engine.THREE.SphereGeometry(),
			engine.materials.characterMaterial
		);

		engine.core.scene.add( transformControl, heroHelper );

		// chain helper

		const material = new engine.THREE.LineBasicMaterial({
			color: 0xff00ff
		});

		const chainHelperPoints = [
			new engine.THREE.Vector3( 0, 0, 0 ),
			new engine.THREE.Vector3( 0, 0, 0 )
		];

		const chainHelperGeometry = new engine.THREE.BufferGeometry().setFromPoints( chainHelperPoints );

		chainHelper = new engine.THREE.Line( chainHelperGeometry, material );
		engine.core.scene.add( chainHelper );

		chainHelper.updateHelper = function ( params ) {

			const startBody = bodies.getFromName( params.start.bodyName );

			chainStartBody = startBody;

			//

			heroHelper.updateMatrixWorld();

			chainHelperPoints[0].set(
				Number( params.start.x ),
				Number( params.start.y ),
				Number( params.start.z )
			);

			chainHelperPoints[1].set(
				Number( params.end.x ),
				Number( params.end.y ),
				Number( params.end.z )
			);

		}

		engine.core.callInLoop( () => {

			_vec0.copy( chainHelperPoints[0] );

			_vec1.copy( chainHelperPoints[1] );

			//

			if ( chainStartBody ) chainStartBody.threeObj.localToWorld( _vec0 );

			heroHelper.localToWorld( _vec1 );

			//

			chainHelperGeometry.setFromPoints( [ _vec0, _vec1 ] );

		} );

		//

		makeGrid();

		//

		const orbitControls = engine.cameraControls.orbitObj( engine.core.scene );

		transformControl.addEventListener( 'mouseDown', () => orbitControls.enabled = false );

		transformControl.addEventListener( 'mouseUp', () => orbitControls.enabled = true );

		transformControl.addEventListener( 'change', (e) => {

			if ( !e.target || !e.target.object ) return

			if ( e.target.object.shapeType === 'sphere' ) {

				const s = e.target.object.scale;

				s.setScalar( ( s.x + s.y + s.z ) / 3 );

			} else if ( e.target.object.shapeType === 'cylinder' ) {

				const s = e.target.object.scale;

				const v = ( s.x + s.z ) / 2;

				s.x = v;
				s.z = v;

			}

		} );

		//

		engine.core.listenClick( (intersects) => {

			if ( !isShiftPressed ) return

			const a = intersects.find( intersect => intersect.object.isEditorShape );

			if ( a ) shapes.selectShape( a.object );

		} );

		//

		engine.core.callInLoop( () => {

			bodies.bodies.forEach( (body) => {

				updateObject.call( body.threeObj, body.transformCode );

			} );

		} );

		//

		editorConsole.log( 'editor initialized. shift+click to select a shape. press S to switch transform mode. press shift+D to duplicate a shape.' );

	} catch ( err ) {

		editorConsole.error( err );
		console.log( err );

	}

}

function updateObject( code ) {

	eval( code );

}

//

function makeGrid() {

	const axesHelper = new engine.THREE.AxesHelper( 100 );

	const grid = new engine.InfiniteGridHelper( 1, 10, new engine.THREE.Color(0xededed) );

	engine.core.scene.add( grid, axesHelper );

}

//

function addLights() {

	const light = new engine.THREE.AmbientLight( 0x404040 );
	const dirLight1 = new engine.THREE.DirectionalLight( 0xffffff, 0.5 );
	const dirLight2 = new engine.THREE.DirectionalLight( 0xffffff, 0.5 );

	dirLight1.position.set( 0.4, 1, -0.2 );
	dirLight2.position.set( 0.2, 1, 0.2 );

	engine.core.scene.add( dirLight1, dirLight2, light );

}

//

export default editorPage
