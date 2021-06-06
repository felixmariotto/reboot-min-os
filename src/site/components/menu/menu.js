
import './menu.css';
import { elem, icon } from '../../utils.js';

//

const menuContainer = elem({ id: 'menu-container' });

const overlay = elem({ id: 'menu-overlay' });

const menu = elem({ id: 'menu' });

menuContainer.append( menu, overlay );

//

menuContainer.show = () => menuContainer.classList.add( 'visible' );

menuContainer.hide = () => menuContainer.classList.remove( 'visible' );

//

export default menuContainer