
import * as THREE from 'three';
import params from '../params.js';

import WorkerWorldFromInfo from  './physicalObjects/WorkerWorldFromInfo.js';

//

const clock = new THREE.Clock();

let world, delta;

//

if ( typeof importScripts !== 'undefined' ) {

	onmessage = function (e) {

		if ( e.data.worldInfo ) {

			world = WorkerWorldFromInfo( e.data.worldInfo );

		}

	}

	loop();

}

//

function loop() {

	requestAnimationFrame( loop );

	delta = clock.getDelta();

	if ( world ) world.update( delta );

}