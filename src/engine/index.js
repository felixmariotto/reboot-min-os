
import * as THREE from 'three';
import threeCore from './core/threeCore.js';
import files from './files/files.js';

//

if ( window ) {

	window.engine = {
		THREE,
		threeCore,
		files
	}

} else {

	console.log( 'no window context' )

}
