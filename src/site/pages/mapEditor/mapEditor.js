
import { elem } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './mapEditor.css';
import bodies from './bodies.js';
import shapes from './shapes.js';
import files from './files.js';
import chain from './chain.js';
import hero from './hero.js';

//

let transformControl, heroHelper, chainHelper, chainStartBody;

const toolModules = [ bodies, shapes, files, chain, hero ];

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
	makeToolButton( 'files', files ),
	'//',
	makeToolButton( 'bodies', bodies ),
	makeToolButton( 'shapes', shapes ),
	'//',
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
	chain.domOptions,
	hero.domOptions
);

//  EVENT LISTENERS

let isShiftPressed = false;

window.addEventListener( 'keydown', (e) => {

	switch ( e.keyCode ) {

		case 83 : switchTransformMode(); break
		case 16 : isShiftPressed = true; break

	}

} );

window.addEventListener( 'keyup', (e) => {

	switch ( e.keyCode ) {

		case 16 : isShiftPressed = false; break

	}

} );

window.addEventListener( 'scene-graph-request', (e) => {

	const sceneInfo = {
		chain: chain.getParams(),
		hero: hero.getPosition()
	}

	sceneInfo.bodies = bodies.bodies.map( (body) => {

		const parsedBody = {
			name: body.name,
			trans: body.transformCode,
			color: body.color,
			tags: body.tags
		};

		console.log( 'parsedBody', parsedBody )

		parsedBody.shapes = body.threeObj.children.map( (shape) => {

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
				break

			}

		} );

		return parsedBody

	} );

	files.saveAsJSON( sceneInfo );

} );

window.addEventListener( 'scene-graph-loaded', (e) => {

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

	chain.fromInfo( info.chain );

	hero.fromInfo( info.hero );

	//

	if ( chainHelper ) chainHelper.updateHelper( chain.getParams() );

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

window.addEventListener( 'end-transform', (e) => {

	transformControl.detach();

} );

// INITIALIZATION

editorPage.start = function start() {

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

}

function updateObject( code ) {

	eval( code );

}

//

function makeGrid() {

	const size = 50;
	const divisions = 50;

	const gridHelper = new engine.THREE.GridHelper( size, divisions );
	const axesHelper = new engine.THREE.AxesHelper( size / 2 );

	engine.core.scene.add( gridHelper, axesHelper );

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
