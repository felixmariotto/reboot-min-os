
import './menu.css';
import { elem, icon, elemFromHTML, vertSpace } from '../../utils.js';

//

const menuContainer = elem({ id: 'menu-container' });

const overlay = elem({ id: 'menu-overlay' });

const menu = elem({ id: 'menu' });

menuContainer.append( menu, overlay );

//

const baseContainer = elem();

const resumeBtn = elem({ html: 'Resume' });
const restartBtn = elem({ html: 'Restart Level' });
const optionsBtn = elem({ html: 'Options' });

optionsBtn.onclick = () => {
	menu.removeChild( baseContainer );
	menu.append( options );
}

baseContainer.append(
	resumeBtn,
	restartBtn,
	optionsBtn
);

menu.append( baseContainer );

//

const options = elem({ id: 'menu-options' });

const camFOV = Range( 'fov', 'Camera FOV', '50', '110', '1' );
const invertCamX = Checkbox( 'invertCamX', 'Invert camera horizontally', false );
const invertCamY = Checkbox( 'invertCamY', 'Invert camera Vertically', false );
const musicVolume = Range( 'musicVolume', 'Music volume', '0', '100', '1' );
const soundVolume = Range( 'soundVolume', 'Sound effects volume', '0', '100', '1' );

const backBtn = elem({ html: 'Back' });

backBtn.onclick = () => {
	menu.removeChild( options );
	menu.append( baseContainer );
}

options.append(
	elem({ tagName: 'H1', html: 'Options' }),
	elem({ tagName: 'H2', html: 'Camera' }),
	camFOV,
	invertCamX,
	invertCamY,
	elem({ tagName: 'H2', html: 'Sound' }),
	musicVolume,
	soundVolume,
	vertSpace( 15 ),
	backBtn
);

// menu.append( options );

//

menuContainer.show = () => menuContainer.classList.add( 'visible' );

menuContainer.hide = () => menuContainer.classList.remove( 'visible' );

function Range( valName, text, min, max, step ) {
	return elemFromHTML(`
		<div>
			<input type="range" id="menu-range-${ valName }" name="${ valName }"
				min="${ min }" max="${ max }, step=${ step }">
			<label for="${ valName }">${ text }</label>
		</div>
	`);
}

function Checkbox( valName, text, checked ) {
	return elemFromHTML(`
		<div>
			<input type="checkbox" id="scales" name="${ valName }"
			${ checked ? 'checked' : '' }>
			<label for="${ valName }">${ text }</label>
		</div>
	`)
}

//

export default menuContainer