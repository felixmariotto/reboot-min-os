
import core from '../core/core.js';

import characterMaterial from './characterMaterial.js';

//

core.callInLoop( function updateMaterials() {

	characterMaterial.userData.update( core.clock.getElapsedTime() );

} );

//

export default {
	characterMaterial
}
