
import './button.css';
import { elem } from '../../utils.js';

//

export default function Button( content ) {

	const domElement = elem({ tagName: 'BUTTON', classes: 'button', html: content });

	domElement.isSelectable = true;

	return domElement

}
