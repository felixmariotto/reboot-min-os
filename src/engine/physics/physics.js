
import WorldFromInfo from './WorldFromInfo.js';

//

let worker

if ( window.Worker ) {

	worker = new Worker('./physicsWorker.js');

}

//

export default {
	WorldFromInfo,
	worker
}
