
import * as THREE from 'three';
import params from '../params.js';

import WorkerWorld from  './workerObjects/WorkerWorld.js';

//

const clock = new THREE.Clock();

let world, delta;

const LOG_PERF = false;
let counter = 0;

//

if ( typeof importScripts !== 'undefined' ) {

	onmessage = function (e) {

		if ( e.data.info ) {

			if ( world ) world.clear();

			world = WorkerWorld( e.data.info );

		} else {

			if ( LOG_PERF ) {
				counter ++
				if ( counter % 60 === 0 ) console.time( 'worker simulation' )
			}

			const positions = e.data.positions;
			const velocities = e.data.velocities;
			const chains = e.data.chains;
			const state = e.data.state;

			const chainPositions = chains.map( chainT => chainT.positions.buffer );

			world.update(
				1 / 60,
				positions,
				velocities,
				chains,
				state
			);

			postMessage(
				{
					positions,
					velocities,
					chains,
					state
				},
				[
					positions.buffer,
					velocities.buffer,
					...chainPositions,
				]
			);

			if ( counter % 60 === 0 && LOG_PERF ) console.timeEnd( 'worker simulation' )

		}

	}

}
