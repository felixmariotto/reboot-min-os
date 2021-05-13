
import World from './World.js';

//

let worker

if ( window.Worker ) {

	worker = new Worker('./physicsWorker.js');

}

//

export default {
	World,
	worker
}
