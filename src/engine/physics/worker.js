
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

		if ( e.data.info ) {

			if ( world ) world.clear();

			world = WorkerWorld( e.data.info );

		} else {

			const positions = e.data.positions;
			const velocities = e.data.velocities;

			world.update( 1 / 60, positions, velocities );

			postMessage(
				{ positions, velocities },
				[ positions.buffer, velocities.buffer ]
			);

		}

	}

}
