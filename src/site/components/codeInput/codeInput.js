
import Button from '../button/Button.js';
import './codeInput.css';

//

const container = document.createElement('DIV');
container.id = 'code-input';

const textArea = document.createElement('TEXTAREA');
textArea.placeholder = 'this.position.x = Math.sin( time / 200 );'
textArea.rows = "10";
textArea.cols = "150";

//

const validateBtn = Button( 'validate' );
validateBtn.style.width = '100px';

validateBtn.onclick = () => {

	const event = new CustomEvent( 'validate', { detail: textArea.value } );

	container.dispatchEvent( event );

}

//

container.append( textArea, validateBtn );
document.body.append( container );

//

let isEnabled = false;

container.toggle = function () {

	if ( isEnabled ) container.classList.remove( 'enabled' );
	else container.classList.add( 'enabled' );

	isEnabled = !isEnabled;

}

container.reset = function () {

	textArea.value = '';

}

container.setContent = function ( text ) {

	textArea.value = text;

}

//

export default container
