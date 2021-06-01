
/*

This web worker is instantiated once and scoped in the physics module.

When the incoming message "data" object contains an "info" parameter, it will create
a local representation of the game physics world, and be responsible for the physics
computation. When it finishes updating the physics, it sends back the new bodies
positions and velocities to the main thread.

*/

import * as THREE from 'three';
import WorkerWorld from  './workerObjects/WorkerWorld.js';

//

const clock = new THREE.Clock();

const LOG_PERF = false;
const events = [];

let counter = 0;
let world;

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

			if ( LOG_PERF && counter % 60 === 0 ) console.timeEnd( 'worker simulation' )

		}

	}

}
