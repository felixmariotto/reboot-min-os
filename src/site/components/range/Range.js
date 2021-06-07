
import './range.css';
import { elem, elemFromHTML } from '../../utils.js';

//

export default function Range( valName, text, min, max, step, value ) {

	if ( min < 0 ) console.warn('I think there will be some issues with a negative value');

	// looks like an html range max value can only be 100 or bellow.
	const coeff = Math.max( 1, max / 100 );

	min /= coeff;
	max /= coeff;
	value /= coeff;
	step /= coeff;

	//

	const input = elemFromHTML(`
		<input type="range" id="menu-range-${ valName }" name="${ valName }"
		min="${ min }" max="${ max }, step=${ step }" value="${ value }">
	`);

	const label = elemFromHTML(`<label for="${ valName }">${ text }</label>`);

	const range = elem({ tagName: 'BUTTON', classes: 'range' });
	range.append( input, label );
	range.isSelectable = true;

	range.moveRight = () => {
		input.value = Number( input.value ) + step;
	}

	range.moveLeft = () => {
		input.value = Number( input.value ) - step;
	}

	range.getValue = () => {
		return {
			name: valName,
			value: Number( input.value ) * coeff
		}
	}

	return range

}