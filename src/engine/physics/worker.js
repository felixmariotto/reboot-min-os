
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

		const positions = e.data.positions

		positions.fill( Math.sin( Date.now() / 200 ) * 10 );

		postMessage( { positions }, [ positions.buffer ] );


	}

}
