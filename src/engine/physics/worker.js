
import * as THREE from 'three';
import params from '../params.js';

import WorkerWorld from  './workerObjects/WorkerWorld.js';

//

const clock = new THREE.Clock();

let world, delta;

const LOG_PERF = true;
let counter = 0;

//

if ( typeof importScripts !== 'undefined' ) {

	onmessage = function (e) {

		// console.log( e );

		const positions = e.data.positions

		postMessage( { positions }, [ positions.buffer ] );


	}

}
