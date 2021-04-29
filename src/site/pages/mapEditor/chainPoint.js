
import './chainPoint.css';
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import shapes from './shapes.js';

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

function addChainPoint() {

	const newChainPoint = ChainPoint();

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

function ChainPoint() {

	const color = makeRandomColor();

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

	object3D.position.x = 3;

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
	const enabledCheck = makeCheckbox( 'enabled' );

	content.append( bodyName, x, y, z, enabledCheck );

	domElement.append( content )

	//

	function setRadius( radius ) {

		this.outer.scale.setScalar( radius );

	}

	function getParams() {

		return {
			bodyName: bodyName.getValue(),
			x: x.getValue(),
			y: y.getValue(),
			z: z.getValue()
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

	const event = new CustomEvent( 'update-chain-points', { detail: getParams() } );

	window.dispatchEvent( event );

}

function getParams() {

	const params = chainPoints.map( chainPoint => chainPoint.getParams() );

	console.log( params )

}

//

export default {
	domOptions: chainPointOptions,
	chainPoints,
	getParams
}
