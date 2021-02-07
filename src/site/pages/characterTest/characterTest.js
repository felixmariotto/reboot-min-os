
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.threeCore.init();

}

//

export default gamePage
