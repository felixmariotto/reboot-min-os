
import Body from './Body.js';
import Sphere from './Sphere.js';

import constants from '../../misc/constants.js';
import events from '../../misc/events.js';
import params from '../../params.js';

//

export default function Player() {

	const sphere = Sphere();
	sphere.makeHelper();

	const playerBody = Body( constants.DYNAMIC_BODY, params.playerWeight );

	playerBody.add( sphere );

	events.on( 'jump-key-down', (e) => {

		if ( playerBody.isOnGround ) playerBody.velocity.y += 0.4;

	} );

	events.on( 'climb-key-down', (e) => {

		console.log('climb')

	} );

	return playerBody

}