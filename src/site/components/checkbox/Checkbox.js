
import './checkbox.css';
import { elem, elemFromHTML } from '../../utils.js';

//

export default function Checkbox( valName, text, checked ) {
	
	const checkbox = elemFromHTML(`
		<button class="checkbox">
			<input type="checkbox" id="scales" name="${ valName }"
			${ checked ? 'checked' : '' }>
			<label for="${ valName }">${ text }</label>
		</button>
	`);

	/*
	const checkbox = elem({
		tagName: 'INPUT',
		type: 'checkbox',
		classes: 'checkbox'
	});
	checkbox.checked = checked;
	*/

	checkbox.isSelectable = true;

	return checkbox;

}