
import threeCore from '../core/threeCore.js';

import characterMaterial from './characterMaterial.js';

//

threeCore.callInLoop( function updateMaterials() {

	characterMaterial.userData.update( threeCore.clock.getElapsedTime() );

} );

//

export default {
	characterMaterial
}
