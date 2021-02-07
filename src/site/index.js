
import './style.css';
import homepage from './pages/homepage/homepage.js';
import loadingBox from './components/loadingBox.js';

//

document.body.append( homepage );

//

window.addEventListener( 'engine-loaded', () => {

	loadingBox.setInitialState();

} );
