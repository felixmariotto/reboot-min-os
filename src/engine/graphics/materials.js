
import core from '../core/core.js';

import characterMaterial from './materials/characterMaterial.js';
import grassMaterial from './materials/grassMaterial.js';
import chainMaterial from './materials/chainMaterial.js';
import dialogueSignMaterial from './materials/dialogueSignMaterial.js';

//

core.callInLoop( function updateMaterials() {

	const elapsedTime = core.clock.getElapsedTime();

	characterMaterial.userData.update( elapsedTime );
	grassMaterial.userData.update( elapsedTime );
	chainMaterial.userData.update( elapsedTime );
	dialogueSignMaterial.userData.update( elapsedTime );

} );

//

export default {
	characterMaterial,
	grassMaterial,
	chainMaterial,
	dialogueSignMaterial
}
