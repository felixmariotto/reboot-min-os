
import * as THREE from 'three';
import params from '../params.js';

import WorkerWorld from  './workerObjects/WorkerWorld.js';

//

const clock = new THREE.Clock();

let world, delta;

const LOG_PERF = true;
let counter = 0;
let events = [];

//

if ( typeof importScripts !== 'undefined' ) {

	self.emitEvent = ( eventName, data ) => {

		postMessage( { isEvent: true, eventName, data } );

	}

	//

	onmessage = function (e) {

		if ( e.data.info ) {

			if ( world ) world.clear();

			world = WorkerWorld( e.data.info );

		} else if ( e.data.isEvent ) {

			const eventName = e.data.eventName;
			const data = e.data.data;

			events.push( { eventName, data } )

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
				clock.getDelta(),
				positions,
				velocities,
				chains,
				state,
				events
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
