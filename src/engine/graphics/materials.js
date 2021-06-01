
import core from '../core/core.js';

import characterMaterial from './characterMaterial.js';
import grassMaterial from './grassMaterial.js';

//

core.callInLoop( function updateMaterials() {

	characterMaterial.userData.update( core.clock.getElapsedTime() );

} );

//

export default {
	characterMaterial,
	grassMaterial
}
