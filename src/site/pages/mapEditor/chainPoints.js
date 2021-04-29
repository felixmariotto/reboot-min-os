
import './chainPoints.css';
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import shapes from './shapes.js';
import bodies from './bodies.js';

//

const chainPoints = [];

const chainPointOptions = elem({ id: 'editor-chain-point-options', classes: 'tool-options' });

//

const toolBar = elem({ id: 'editor-chain-point-toolbar' });

chainPointOptions.append( toolBar );

//

toolBar.append(
	makeTool( 'far fa-plus-square', addChainPoint )
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

function addChainPoint( info ) {

	const newChainPoint = ChainPoint( info );

	chainPoints.push( newChainPoint );

	chainPointList.append( newChainPoint.domElement );

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

	const color = info ? new engine.THREE.Color( '#' + info.color ) : makeRandomColor();

	const object3D = new engine.THREE.Group();

	const outer = new engine.THREE.Mesh(
		new engine.THREE.IcosahedronGeometry( 1, 1 ),
		new engine.THREE.MeshPhongMaterial({ wireframe: true, color })
	);

	const inner = new engine.THREE.Mesh(
		new engine.THREE.IcosahedronGeometry( 0.3 ),
		new engine.THREE.MeshPhongMaterial({ color })
	);

	object3D.add( inner, outer );

	engine.core.scene.add( object3D );

	//

	const domElement = elem({ classes: 'editor-chain-point-line' });

	domElement.style.backgroundColor = '#' + new engine.THREE.Color( color ).getHexString();
	
	domElement.style.color = 'black';

	//

	const content = elem({ classes: 'editor-chain-point-section' });

	const bodyName = makeInput( 'body name', '' )
	const x = makeInput( 'x', 0 );
	const y = makeInput( 'y', 0 );
	const z = makeInput( 'z', 0 );
	const radius = makeInput( 'radius', 1 );
	const enabledCheck = makeCheckbox( 'enabled' );

	content.append( bodyName, x, y, z, radius, enabledCheck );

	domElement.append( content )

	//

	if ( info ) {

		bodyName.setValue( info.bodyName );
		x.setValue( info.x );
		y.setValue( info.y );
		z.setValue( info.z );
		radius.setValue( info.radius );
		enabledCheck.setValue( info.enabled );

	}

	//

	function setRadius( radius ) {

		this.outer.scale.setScalar( radius );

	}

	function getParams() {

		return {
			bodyName: bodyName.getValue(),
			x: x.getValue(),
			y: y.getValue(),
			z: z.getValue(),
			radius: radius.getValue(),
			enabled: enabledCheck.getValue(),
			color: color.getHexString()
		}

	}

	//

	return {
		object3D,
		inner,
		outer,
		color,
		domElement,
		setRadius,
		getParams
	}

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

	chainPoints.forEach( (chainPoint) => {

		const params = chainPoint.getParams();

		const body = bodies.getFromName( params.bodyName );

		if ( body ) body.threeObj.add( chainPoint.object3D );

		chainPoint.object3D.position.set(
			Number( params.x ),
			Number( params.y ),
			Number( params.z )
		);

		chainPoint.setRadius( Number( params.radius ) );

	} );

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
