
import './menu.css';
import { elem, icon, vertSpace } from '../../utils.js';
import Button from '../button/Button.js';
import Range from '../range/Range.js';
import Checkbox from '../checkbox/Checkbox.js';
import List from '../list/List.js';

//

const menuContainer = elem({ id: 'menu-container' });

const overlay = elem({ id: 'menu-overlay' });

const menu = elem({ id: 'menu' });

menuContainer.append( menu, overlay );

//

const baseList = List();
baseList.id = 'menu-base-list';

const resumeBtn = Button( 'Resume' );
const restartBtn = Button( 'Restart Level' );
const optionsBtn = Button( 'Options' );

resumeBtn.onclick = () => {

	// Failure to enable pointerlock happen very easily in Chrome.
	// See : https://bugs.chromium.org/p/chromium/issues/detail?id=1127223
	engine.core.makeSurePointerLock()
	.then( (resp) => {
		if ( resp === 'success' ) {
			engine.levelManager.resume();
			menuContainer.hide();
		}
	} )
	.catch( err => console.log(err) );

}

restartBtn.onclick = () => {

	// Failure to enable pointerlock happen very easily in Chrome.
	// See : https://bugs.chromium.org/p/chromium/issues/detail?id=1127223
	engine.core.makeSurePointerLock()
	.then( (resp) => {
		if ( resp === 'success' ) {
			engine.levelManager.restart();
			menuContainer.hide();
		}
	} )
	.catch( err => console.log(err) );

}

optionsBtn.onclick = () => {
	menu.removeChild( baseList );
	menu.append( optionsList );
	baseList.disable();
	optionsList.enable();
}

baseList.append(
	elem({ tagName: 'H1', html: 'Menu' }),
	resumeBtn,
	restartBtn,
	optionsBtn
);

menu.append( baseList );

//

const optionsList = List();

optionsList.addEventListener( 'update-values', (e) => {

	engine.emit( 'update-params', e.detail );

	// console.log( e.detail );

} );

const camFOV = Range( 'fov', 'Camera FOV', 50, 120, 10, 80 );
const invertCamX = Checkbox( 'invertCamX', 'Invert camera horizontally', false );
const invertCamY = Checkbox( 'invertCamY', 'Invert camera Vertically', false );
const musicVolume = Range( 'musicVolume', 'Music volume', 0, 100, 10, 100 );
const soundVolume = Range( 'soundVolume', 'Sound effects volume', 0, 100, 10, 100 );

const backBtn = Button( 'Back' );

backBtn.onclick = () => {
	menu.removeChild( optionsList );
	menu.append( baseList );
	optionsList.disable();
	baseList.enable();
}

optionsList.append(
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

//

menuContainer.show = () => {
	menuContainer.classList.add( 'visible' );
	baseList.enable();
}

menuContainer.hide = () => {
	menuContainer.classList.remove( 'visible' );
	baseList.disable();
}

//

export default menuContainer