
import './range.css';
import { elemFromHTML } from '../../utils.js';

//

export default function Range( valName, text, min, max, step ) {

	const range = elemFromHTML(`
		<button class="range">
			<input type="range" id="menu-range-${ valName }" name="${ valName }"
				min="${ min }" max="${ max }, step=${ step }">
			<label for="${ valName }">${ text }</label>
		</button>
	`);

	range.isSelectable = true;

	return range

}