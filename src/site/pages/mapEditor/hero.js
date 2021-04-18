
import './hero.css';
import { elem } from '../../utils.js';

//

const heroOptions = elem({ id: 'editor-hero-options', classes: 'tool-options' });

//

const x = makeInput( 'x' )
const y = makeInput( 'y' )
const z = makeInput( 'z' )

heroOptions.append( x, y, z );

//

function makeInput( title ) {

	const container = elem({ classes: 'editor-hero-input-container' });

	const text = elem({ tagName: 'P', html: title });
	const input = elem({ tagName: 'INPUT' });

	container.append( title, input );

	container.getValue = () => input.value;
	container.setValue = (v) => input.value = v;

	input.onchange = handleChange;

	return container

}

//

function handleChange() {

	const event = new CustomEvent( 'update-hero', { detail: getPosition() } );

	window.dispatchEvent( event );

}

//

function getPosition() {

	return {
		x: x.getValue(),
		y: y.getValue(),
		z: z.getValue()
	};

}

function fromInfo( info ) {

	x.setValue( info.x );
	y.setValue( info.y );
	z.setValue( info.z );

}

//

export default {
	domOptions: heroOptions,
	getPosition,
	fromInfo
}
