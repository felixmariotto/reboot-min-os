
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

			const chainPositions = chains.map( chainT => chainT.positions.buffer );
			const chainVelocities = chains.map( chainT => chainT.velocities.buffer );

			world.update( 1 / 60, positions, velocities, chains );

			postMessage(
				{
					positions,
					velocities,
					chains
				},
				[
					positions.buffer,
					velocities.buffer,
					...chainPositions,
					...chainVelocities
				]
			);

			if ( counter % 60 === 0 && LOG_PERF ) console.timeEnd( 'worker simulation' )

		}

	}

}
