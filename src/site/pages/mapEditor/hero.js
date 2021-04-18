
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

	input.onchange = handleChange;

	return container

}

//

function handleChange() {

	const pos = {
		x: x.getValue(),
		y: y.getValue(),
		z: z.getValue()
	};

	const event = new CustomEvent( 'update-hero', { detail: pos } );

	window.dispatchEvent( event );

}

//

export default {
	domOptions: heroOptions
}
