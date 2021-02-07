
import './loadingBox.css';
import { elem } from '../utils.js';

//

const loadingBox = elem({ id: 'loading-box' });

//

loadingBox.setLoadingEngineState = function setLoadingEngineState() {

	loadingBox.innerHTML = 'loading engine';

}

loadingBox.setInitialState = function setInitialState() {

	loadingBox.innerHTML = '0%';

}

loadingBox.setUploadingState = function setUploadingState( percent ) {

	loadingBox.innerHTML = percent + '%';

}

loadingBox.setEndState = function setEndState() {

	loadingBox.innerHTML = 'click to play';

}

//

loadingBox.setLoadingEngineState();

//

export default loadingBox
