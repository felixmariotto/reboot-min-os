
import core from '../core/core.js';

import characterMaterial from './characterMaterial.js';
import grassMaterial from './grassMaterial.js';

//

core.callInLoop( function updateMaterials() {

	const elapsedTime = core.clock.getElapsedTime();

	characterMaterial.userData.update( elapsedTime );
	grassMaterial.userData.update( elapsedTime );

} );

//

export default {
	characterMaterial,
	grassMaterial
}
