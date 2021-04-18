
import './chain.css';
import { elem } from '../../utils.js';

//

const chainOptions = elem({ id: 'editor-chain-options', classes: 'tool-options' });

//

const startSection = elem({ classes: 'editor-chain-section' });

startSection.append(
	elem({ tagName: 'P', html: 'START BODY END' }),
	makeInput( 'body name', '' ),
	makeInput( 'x', 0 ),
	makeInput( 'y', 0 ),
	makeInput( 'z', 0 )
);

//

const endSection = elem({ classes: 'editor-chain-section' });

endSection.append(
	elem({ tagName: 'P', html: 'PLAYER END' }),
	makeInput( 'x', 0 ),
	makeInput( 'y', 0 ),
	makeInput( 'z', 0 )
);

//

const lengthSection = elem({ classes: 'editor-chain-section' });

lengthSection.append(
	elem({ tagName: 'P', html: 'LENGTH' }),
	makeInput( 'length', 20 )
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

	return container

}

//

export default {
	domOptions: chainOptions
}
