
// List element designed to be controlable with a gamepad

export default function List() {

	let listening, handling;

	const elem = document.createElement('DIV');

	// enable gamepad control
	elem.enable = function () {

		if ( !listening ) {

			engine.on( 'joystick-hit-up', () => {

				if ( handling ) console.log('move up')

			} );

			engine.on( 'joystick-hit-down', () => {

				if ( handling ) console.log('move down')

			} );

			listening = true;

		}

		handling = true;
		
	}

	elem.disable = function () {
		
		handling = false;

	}

	return elem

}
