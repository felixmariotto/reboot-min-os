
import './loadingBox.css';
import { elem } from '../../utils.js';

//

const loadingBox = elem({ id: 'loading-box' });

//

loadingBox.setLoadingEngineState = function setLoadingEngineState() {

	loadingBox.innerHTML = 'loading engine';

}

loadingBox.setInitialState = function setInitialState() {

	loadingBox.innerHTML = 'click to play';

}

loadingBox.setUploadingState = function setUploadingState( percent ) {

	loadingBox.innerHTML = percent + '%';

}

//

loadingBox.setLoadingEngineState();

//

export default loadingBox
