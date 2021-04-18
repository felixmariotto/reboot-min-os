
import './chain.css';
import { elem } from '../../utils.js';

//

const chainOptions = elem({ id: 'editor-chain-options', classes: 'tool-options' });

//

const startSection = elem({ classes: 'editor-chain-section' });

const startBodyName = makeInput( 'body name', '' )
const startX = makeInput( 'x', 0 );
const startY = makeInput( 'y', 0 );
const startZ = makeInput( 'z', 0 );

startSection.append(
	elem({ tagName: 'P', html: 'START BODY END' }),
	startBodyName,
	startX,
	startY,
	startZ
);

//

const endSection = elem({ classes: 'editor-chain-section' });

const endX = makeInput( 'x', 0 );
const endY = makeInput( 'y', 0 );
const endZ = makeInput( 'z', 0 );

endSection.append(
	elem({ tagName: 'P', html: 'PLAYER END' }),
	endX,
	endY,
	endZ
);

//

const lengthSection = elem({ classes: 'editor-chain-section' });

const length = makeInput( 'length', 20 );

lengthSection.append(
	elem({ tagName: 'P', html: 'LENGTH' }),
	length
);

//

chainOptions.append( startSection, endSection, lengthSection );

//

function makeInput( title, defaultVal ) {

	const container = elem({ classes: 'editor-chain-input-container' });

	const text = elem({ tagName: 'P', html: title });
	const input = elem({ tagName: 'INPUT' });
	input.value = defaultVal;

	container.append( title, input );

	container.getValue = () => input.value;
	container.setValue = (v) => input.value = v;

	input.onchange = handleChange;

	return container

}

//

function getParams() {

	return {
		start: {
			bodyName: startBodyName.getValue(),
			x: startX.getValue(),
			y: startY.getValue(),
			z: startZ.getValue()
		},
		end: {
			x: endX.getValue(),
			y: endY.getValue(),
			z: endZ.getValue()
		},
		length: length.getValue()
	}

}

function handleChange() {

	const event = new CustomEvent( 'update-chain', { detail: getParams() } );

	window.dispatchEvent( event );

}

function fromInfo( info ) {

	startBodyName.setValue( info.start.bodyName )
	startX.setValue( info.start.x );
	startY.setValue( info.start.y );
	startZ.setValue( info.start.z );
	endX.setValue( info.end.x );
	endY.setValue( info.end.y );
	endZ.setValue( info.end.z );
	length.setValue( info.length );

}

//

export default {
	domOptions: chainOptions,
	getParams,
	fromInfo
}
