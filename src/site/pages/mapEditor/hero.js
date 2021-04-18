
import './hero.css';
import { elem } from '../../utils.js';

//

const heroOptions = elem({ id: 'editor-hero-options', classes: 'tool-options' });

//

heroOptions.append(
	makeInput( 'x' ),
	makeInput( 'y' ),
	makeInput( 'z' )
);

//

function makeInput( title ) {

	const container = elem({ classes: 'editor-hero-input-container' });

	const text = elem({ tagName: 'P', html: title });
	const input = elem({ tagName: 'INPUT' });

	container.append( title, input );

	return container

}

//

export default {
	domOptions: heroOptions
}
