
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	console.log('start character test');

	loadingBox.setUploadingState( 50 );

}

//

export default gamePage
