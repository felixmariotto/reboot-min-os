
import './chainPoints.css';
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import bodies from './bodies.js';
import editorConsole from './editorConsole.js';

//

const chainPoints = [];

let selectedLine;

const chainPointOptions = elem({ id: 'editor-chain-point-options', classes: 'tool-options' });

//

const toolBar = elem({ id: 'editor-chain-point-toolbar' });

chainPointOptions.append( toolBar );

//

toolBar.append(
	makeTool( 'far fa-plus-square', addChainPoint ),
	makeTool( 'far fa-trash-alt', removeChainPoint )
);

function makeTool( iconClasses, callback ) {

	const toolIcon = icon( iconClasses );

	const button = Button( toolIcon );

	button.onclick = () => callback();

	return button

}

//

const listContainer = elem({ id: 'editor-chain-point-list-container' })
const chainPointList = elem({ id: 'editor-chain-point-list' });

chainPointOptions.append( listContainer );
listContainer.append( chainPointList );

//

function selectLine( line ) {
	
	if ( selectedLine ) selectedLine.domElement.classList.remove( 'selected' );

	line.domElement.classList.add( 'selected' );

	selectedLine = line;

}

//

function addChainPoint( info ) {

	const newChainPoint = ChainPoint( info );

	chainPoints.push( newChainPoint );

	chainPointList.append( newChainPoint.domElement );

}

//

function removeChainPoint() {

	if ( selectedLine ) {

		const toDelete = selectedLine;

		toDelete.clear();

	} else {

		editorConsole.warn( 'no chain point selected for removal' )

	}

}

//

function makeRandomColor() {

	const color = new engine.THREE.Color();

	color.r = 0.4 + ( Math.random() * 0.6 );
	color.g = 0.4 + ( Math.random() * 0.6 );
	color.b = 0.4 + ( Math.random() * 0.6 );

	return color

}

//

function ChainPoint( info ) {

	const chainPoint = {
		setRadius,
		setLength,
		getParams,
		clear
	}

	//

	const DEFAULT_LENGTH = 20;

	chainPoint.color = info ? new engine.THREE.Color( '#' + info.color ) : makeRandomColor();

	chainPoint.object3D = new engine.THREE.Group();

	chainPoint.outer = new engine.THREE.Mesh(
		new engine.THREE.IcosahedronGeometry( DEFAULT_LENGTH, 3 ),
		new engine.THREE.MeshPhongMaterial({
			wireframe: true,
			color: chainPoint.color,
			transparent: true,
			opacity: 0.3
		})
	);

	chainPoint.inner = new engine.THREE.Mesh(
		new engine.THREE.IcosahedronGeometry( 1, 1 ),
		new engine.THREE.MeshPhongMaterial({ wireframe: true, color: chainPoint.color })
	);

	chainPoint.core = new engine.THREE.Mesh(
		new engine.THREE.IcosahedronGeometry( 0.3 ),
		new engine.THREE.MeshPhongMaterial({ color: chainPoint.color })
	);

	chainPoint.object3D.add( chainPoint.inner, chainPoint.outer, chainPoint.core );

	engine.core.scene.add( chainPoint.object3D );

	//

	chainPoint.domElement = elem({ classes: 'editor-chain-point-line' });

	chainPoint.domElement.style.backgroundColor = '#' + new engine.THREE.Color( chainPoint.color ).getHexString();
	
	chainPoint.domElement.style.color = 'black';

	chainPoint.domElement.onclick = () => selectLine( chainPoint );

	//

	const content = elem({ classes: 'editor-chain-point-section' });

	const bodyName = makeInput( 'body name', '' )
	const x = makeInput( 'x', 0 );
	const y = makeInput( 'y', 0 );
	const z = makeInput( 'z', 0 );
	const length = makeInput( 'length', 20 );
	const radius = makeInput( 'attach radius', 1 );
	const enabledCheck = makeCheckbox( 'enabled' );
	const initCheck = makeCheckbox( 'initial chain' );
	initCheck.setValue( false );

	content.append( bodyName, x, y, z, length, radius, enabledCheck, initCheck );

	chainPoint.domElement.append( content )

	//

	if ( info ) {

		bodyName.setValue( info.bodyName );
		x.setValue( info.x );
		y.setValue( info.y );
		z.setValue( info.z );
		length.setValue( info.length );
		radius.setValue( info.radius );
		enabledCheck.setValue( info.enabled );
		initCheck.setValue( info.init );

	}

	//

	function setRadius( radius ) {

		this.inner.scale.setScalar( radius );

	}

	function setLength( length ) {

		this.outer.scale.setScalar( length / DEFAULT_LENGTH );

	}

	function getParams() {

		return {
			bodyName: bodyName.getValue(),
			x: x.getValue(),
			y: y.getValue(),
			z: z.getValue(),
			length: length.getValue(),
			radius: radius.getValue(),
			enabled: enabledCheck.getValue(),
			init: initCheck.getValue(),
			color: chainPoint.color.getHexString()
		}

	}

	function clear() {

		this.domElement.remove();

		this.object3D.parent.remove( this.object3D );

		this.inner.material.dispose();
		this.inner.geometry.dispose();
		this.outer.material.dispose();
		this.outer.geometry.dispose();
		this.core.material.dispose();
		this.core.geometry.dispose();

		chainPoints.splice( chainPoints.indexOf( this ), 1 );

	}

	//

	return chainPoint

}

//

function makeInput( title, defaultVal ) {

	const container = elem();

	const input = elem({ tagName: 'INPUT' });
	input.value = defaultVal;

	container.append( title, input );

	container.getValue = () => input.value;
	container.setValue = (v) => input.value = v;

	input.onchange = handleChange;

	return container

}

function makeCheckbox( title ) {

	const container = elem();

	const input = elem({ tagName: 'INPUT' });
	input.type = 'checkbox';
	input.checked = true;

	container.append( title, input );

	container.getValue = () => input.checked;
	container.setValue = (v) => input.checked = v;

	input.onchange = handleChange;

	return container

}

function handleChange() {

	const allParams = chainPoints.map( (cp) => {

		const params = cp.getParams();

		const body = bodies.getFromName( params.bodyName );

		if ( body ) body.threeObj.add( cp.object3D );

		cp.object3D.position.set(
			Number( params.x ),
			Number( params.y ),
			Number( params.z )
		);

		cp.setRadius( Number( params.radius ) );
		cp.setLength( Number( params.length ) );

		return params

	} );

	const initCPs = allParams.filter( params => params.init );

	if ( initCPs.length > 1 ) {

		editorConsole.warn( 'There is more than one initial chain point.' );

	}

	const event = new CustomEvent( 'update-chain' );

	window.dispatchEvent( event );

}

function getParams() {

	return chainPoints.map( chainPoint => chainPoint.getParams() );

}

function fromInfo( chainPointsInfo ) {

	if ( !chainPointsInfo ) return

	chainPointsInfo.forEach( info => addChainPoint( info ) );

	handleChange();

}

//

export default {
	domOptions: chainPointOptions,
	chainPoints,
	getParams,
	fromInfo
}
