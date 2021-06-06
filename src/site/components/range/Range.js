
import './range.css';
import { elem, elemFromHTML } from '../../utils.js';

//

export default function Range( valName, text, min, max, step ) {

	const input = elemFromHTML(`
		<input type="range" id="menu-range-${ valName }" name="${ valName }"
		min="${ min }" max="${ max }, step=${ step }">
	`);

	const label = elemFromHTML(`<label for="${ valName }">${ text }</label>`);

	const range = elem({ tagName: 'BUTTON', classes: 'range' });
	range.append( input, label );
	range.isSelectable = true;

	range.moveRight = () => {
		input.value = Number( input.value ) + step;
		console.log( input.value )
	}

	range.moveLeft = () => {
		input.value = Number( input.value ) - step;
		console.log( input.value )
	}

	return range

}