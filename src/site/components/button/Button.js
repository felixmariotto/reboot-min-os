
import './Button.css';
import { elem } from '../../utils.js';

//

export default function Button( content ) {

	const domElement = elem({ classes: 'button', html: content });

	return domElement

}