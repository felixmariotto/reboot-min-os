
import threeCore from './core/threeCore.js';

//

if ( window ) {

	window.engine = {
		threeCore
	}
	
} else {

	console.log( 'no window context' )

}
