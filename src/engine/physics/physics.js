
import World from './physicalObjects/World.js';
import Body from './physicalObjects/Body.js';
import Chain from './physicalObjects/Chain.js';

import Box from './physicalObjects/Box.js';
import Sphere from './physicalObjects/Sphere.js';

import WorldFromInfo from './WorldFromInfo.js';

//

let worker

if ( window.Worker ) {

	worker = new Worker('./physicsWorker.js');

	worker.postMessage({
		foo: 'bar',
		baz: 42
	});

}

//

export default {
	World,
	Body,
	Chain,
	Box,
	Sphere,
	WorldFromInfo,
	worker
}
