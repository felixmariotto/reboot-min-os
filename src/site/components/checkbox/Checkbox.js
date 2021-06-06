
import './checkbox.css';
import { elem, elemFromHTML } from '../../utils.js';

//

export default function Checkbox( valName, text, checked ) {
	
	const input = elemFromHTML(`
		<input type="checkbox" id="scales" name="${ valName }"
		${ checked ? 'checked' : '' }>
	`);

	const label = elemFromHTML(`<label for="${ valName }">${ text }</label>`);

	const checkbox = elem({ tagName: 'BUTTON', classes: 'checkbox' });
	checkbox.append( input, label );
	checkbox.isSelectable = true;

	checkbox.onclick = () => {

		input.checked = !input.checked;

	}

	return checkbox;

}