
import Body from './Body.js';
import Sphere from './Sphere.js';

import constants from '../../misc/constants.js';
import params from '../../params.js';

//

export default function Player() {

	const sphere = Sphere();

	//

	const playerBody = Body(
		constants.DYNAMIC_BODY,
		params.playerWeight,
		params.playerMass
	);

	playerBody.add( sphere );

	playerBody.currentLink = 0;

	playerBody.isPlayer = true;

	//

	return playerBody

}
