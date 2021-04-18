
import './chain.css';
import { elem } from '../../utils.js';

//

const chainOptions = elem({ id: 'editor-chain-options', classes: 'tool-options' });

//

const startSection = elem({ classes: 'editor-chain-section' });

startSection.append(
	elem({ tagName: 'P', html: 'START BODY END' }),
	makeInput( 'body name' ),
	makeInput( 'x' ),
	makeInput( 'y' ),
	makeInput( 'z' )
);

//

const endSection = elem({ classes: 'editor-chain-section' });

endSection.append(
	elem({ tagName: 'P', html: 'PLAYER END' }),
	makeInput( 'x' ),
	makeInput( 'y' ),
	makeInput( 'z' )
);

//

chainOptions.append( startSection, endSection );

//

function makeInput( title ) {

	const container = elem({ classes: 'editor-chain-input-container' });

	const text = elem({ tagName: 'P', html: title });
	const input = elem({ tagName: 'INPUT' });

	container.append( title, input );

	return container

}

//

export default {
	domOptions: chainOptions
}
