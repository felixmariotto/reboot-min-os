
/*

Physics module.

The World class is instantiated once per level, and all of these instances
use the same worker scoped in this module.

*/

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
