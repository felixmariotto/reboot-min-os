
import './biomeOverlay.css';
import { elem } from '../../utils.js';

import meadowsImageURL from '../../../assets/images/biome-overlays/biome-overlay-meadows.png';

//

const overlay = elem({ id: 'biome-overlay' });

const img = elem({ tagName: 'IMG' });
img.src = meadowsImageURL;

overlay.append( img );

overlay.animate = () => {

	overlay.classList.remove( 'animate' );

	setTimeout( () => {
		overlay.classList.add( 'animate' );
	}, 0 );

}

//

export default overlay
