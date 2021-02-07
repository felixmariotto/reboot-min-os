
import './style.css';
import homepage from './pages/homepage.js';

//

document.body.append( homepage );

//

window.addEventListener( 'engine-loaded', () => {

	console.log( 'can start game' );

} );
