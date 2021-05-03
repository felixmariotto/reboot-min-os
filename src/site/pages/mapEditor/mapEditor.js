
import { elem } from '../../utils.js';
import Button from '../../components/button/Button.js';
import './mapEditor.css';
import editorConsole from './editorConsole.js';
import bodies from './bodies.js';
import shapes from './shapes.js';
import files from './files.js';
import chainPoints from './chainPoints.js';
import player from './player.js';

//

let transformControl, transformContainer, playerHelper, chainHelper, chainStartBody;

const toolModules = [ bodies, shapes, files, chainPoints, player ];

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
	makeToolButton( 'player', player )
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
	player.domOptions
);

//  EVENT LISTENERS

let isShiftPressed = false;

window.addEventListener( 'keydown', (e) => {

	if ( e.code === "Escape" ) document.activeElement.blur();

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
		chainPoints: chainPoints.getParams(),
		player: player.getPosition()
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
		.map( shape => shape.getInfo() );

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

		engine.core.scene.add( transformControl, transformContainer, playerHelper, chainHelper );

		makeGrid();

		addLights();

		// copy file params in project

		info.bodies.forEach( (bodyInfo) => {

			bodies.fromInfo( bodyInfo );

		} );

		chainPoints.fromInfo( info.chainPoints );

		player.fromInfo( info.player );

		//

		if ( chainHelper ) chainHelper.updateHelper();

		//

		editorConsole.log( 'a scene has been successfully imported')

	} catch ( err ) {

		editorConsole.error( err );
		console.log( err );

	}

} );

window.addEventListener( 'update-player', (e) => {

	playerHelper.position.copy( e.detail );

	chainHelper.updateHelper();

} );

window.addEventListener( 'update-chain', () => {

	chainHelper.updateHelper();

} );

// TRANSFORM CONTROLS

const transformModes = [ 'translate', 'rotate', 'scale' ];
let transformMode = 0;
function getTransformMode() { return transformModes[ transformMode ] }

function switchTransformMode() {

	if ( !transformControl ) return

	// we don't want to scale if there is more than one objec to scale.
	const max = transformContainer.children.length > 1 ? 2 : 3;

	transformMode = ( transformMode + 1 ) % max;

	transformControl.setMode( transformModes[ transformMode ] );

}

window.addEventListener( 'transform-shape', (e) => {

	detachTransformControl();

	positionTransformControl( e.detail );

	// we don't want to scale if there is more than one object
	// to transform, because we only want axis-aligned scale from center.
	if (
		e.detail.length > 1 &&
		getTransformMode() === 'scale'
	) {
		switchTransformMode();
	}

	if ( e.detail.length === 1 ) transformContainer.rotation.copy( e.detail[0].rotation );

	transformControl.attach( transformContainer );

	e.detail.forEach( shape => transformContainer.attach( shape ) );

} );

window.addEventListener( 'end-transform', detachTransformControl );

function positionTransformControl( objects ) {

	const _box3 = new engine.THREE.Box3();

	_box3.setFromObject( objects[0] );

	objects.forEach( object => _box3.expandByObject( object ) );

	_box3.getCenter( transformContainer.position );

}

function detachTransformControl() {

	for ( let i=transformContainer.children.length-1 ; i>-1 ; i-- ) {

		if ( transformContainer.children[i].owner ) {

			transformContainer.children[i].owner.threeObj.attach( transformContainer.children[i] );

		} else {

			engine.core.scene.attach( transformContainer.children[i] );

		}

	}

	transformControl.detach( transformContainer );

	transformContainer.rotation.set( 0, 0, 0 );
	transformContainer.scale.setScalar( 1 );

}

// INITIALIZATION

editorPage.start = function start() {

	try {

		const _vec0 = new engine.THREE.Vector3();
		const _vec1 = new engine.THREE.Vector3();
		const _mat = new engine.THREE.Matrix4();

		//

		engine.core.init( editorViewport );

		addLights();

		//

		transformControl = new engine.TransformControls( engine.core.camera, editorViewport );
		transformControl.setSpace( 'local' );
		transformContainer = new engine.THREE.Group();
		transformContainer.isTransformContainer = true;

		playerHelper = new engine.THREE.Mesh(
			new engine.THREE.SphereGeometry(),
			engine.materials.characterMaterial
		);

		engine.core.scene.add( transformControl, transformContainer, playerHelper );

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

		chainHelper.updateHelper = function updateHelper() {

			const cpParams = chainPoints.getParams();

			const initCPs = cpParams.filter( params => params.init );

			if ( !initCPs.length ) {

				chainHelper.visible = false;

			} else {

				chainHelper.visible = true;

				const chainParams = initCPs[0];

				chainStartBody = bodies.getFromName( chainParams.bodyName );

				const playerPos = player.getPosition();

				//

				playerHelper.updateMatrixWorld();

				chainHelperPoints[0].set(
					Number( playerPos.x ),
					Number( playerPos.y ),
					Number( playerPos.z )
				);

				if ( chainParams ) {

					chainHelperPoints[1].set(
						Number( chainParams.x ),
						Number( chainParams.y ),
						Number( chainParams.z )
					);

				}

			}

		}

		//

		engine.core.callInLoop( () => {

			_vec0.copy( chainHelperPoints[0] );

			_vec1.copy( chainHelperPoints[1] );

			if ( chainStartBody ) chainStartBody.threeObj.localToWorld( _vec1 );

			chainHelperGeometry.setFromPoints( [ _vec0, _vec1 ] );

		} );

		//

		makeGrid();

		//

		const orbitControls = engine.cameraControls.orbitObj( engine.core.scene );

		transformControl.addEventListener( 'mouseDown', () => orbitControls.enabled = false );

		transformControl.addEventListener( 'mouseUp', () => orbitControls.enabled = true );

		// clamp scale transforms depending on the shape
		transformControl.addEventListener( 'change', (e) => {

			if (
				!e.target ||
				!e.target.object ||
				e.target.object.children.length !== 1
			) {
				return
			}

			//

			const scaledContainer = e.target.object;
			const s = scaledContainer.scale;
			const shape = e.target.object.children[0];

			if ( shape.shapeType === 'sphere' ) {

				s.setScalar( ( s.x + s.y + s.z ) / 3 );

			} else if ( shape.shapeType === 'cylinder' ) {

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
