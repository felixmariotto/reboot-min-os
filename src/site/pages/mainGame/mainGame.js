
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

//

const gamePage = elem({ id:'main-game-page', classes: 'game-container' });

//

gamePage.start = function start() {

	console.log('start game');

	loadingBox.setUploadingState( 50 );

}

//

export default gamePage
