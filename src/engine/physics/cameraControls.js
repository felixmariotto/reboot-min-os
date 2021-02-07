
import * as THREE from 'three';

import threeCore from '../core/threeCore.js';
import params from '../params.js';

//

threeCore.callInLoop( loop );

let loopCallback;

//

const _vec1 = new THREE.Vector3();

//

function followObj( target ) {

	loopCallback = () => {

		/* position behind the player */

		threeCore.camera.position.copy( params.thirdPersCameraTarget );

		// target.getWorldDirection( _vec1 );
		// _vec1.add( target.position );

		/* look at the player */

		threeCore.camera.lookAt( target.position );

	}

}

//

function loop() {

	if ( loopCallback ) loopCallback();

}

//

export default {
	followObj
}
