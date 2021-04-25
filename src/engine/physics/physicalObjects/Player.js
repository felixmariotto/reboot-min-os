
import Body from './Body.js';
import Sphere from './Sphere.js';

import constants from '../../misc/constants.js';
import events from '../../misc/events.js';
import params from '../../params.js';

//

export default function Player() {

	const sphere = Sphere();

	sphere.makeHelper();

	//

	const playerBody = Body( constants.DYNAMIC_BODY, params.playerWeight );

	playerBody.add( sphere );

	playerBody.currentLink = 0;

	playerBody.isPlayer = true;

	//

	events.on( 'jump-key-down', (e) => {

		if ( playerBody.isOnGround ) playerBody.velocity.y += 0.4;

	} );

	events.on( 'pull-key-down', (e) => {

		if ( !playerBody.chain ) return

		playerBody.currentLink = Math.min(
			playerBody.currentLink + 1,
			playerBody.chain.points.length - 2
		);

	} );

	return playerBody

}