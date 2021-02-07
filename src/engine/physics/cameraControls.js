
// import * as THREE from 'three';

import threeCore from '../core/threeCore.js';
import params from '../params.js';

//

threeCore.callInLoop( loop );

let loopCallback;

//

function followObj( target ) {

	threeCore.camera.position.copy( params.thirdPersCameraTarget );

	loopCallback = () => {

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
