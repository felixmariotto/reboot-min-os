
import './player.css';
import { elem } from '../../utils.js';

//

const playerOptions = elem({ id: 'editor-player-options', classes: 'tool-options' });

//

const x = makeInput( 'x' )
const y = makeInput( 'y' )
const z = makeInput( 'z' )

playerOptions.append( x, y, z );

//

function makeInput( title ) {

	const container = elem({ classes: 'editor-player-input-container' });

	const input = elem({ tagName: 'INPUT' });

	container.append( title, input );

	container.getValue = () => input.value;
	container.setValue = (v) => input.value = v;

	input.onchange = handleChange;

	return container

}

//

function handleChange() {

	const event = new CustomEvent( 'update-player', { detail: getPosition() } );

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

	handleChange();

}

//

export default {
	domOptions: playerOptions,
	getPosition,
	fromInfo
}
