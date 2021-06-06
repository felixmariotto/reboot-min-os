
// List element designed to be controlable with a gamepad

export default function List() {

	let listening, handling;
	let currentElement = 0;

	const elem = document.createElement('DIV');

	//

	function select() {

		const selectables = getSelectables();

		selectables[ currentElement ].focus();

	}

	function getSelectables() {

		const children = Array.from( elem.children );

		return children.filter( e => e.isSelectable );

	}

	// Called on joystick hits up or down.

	function moveUp() {

		currentElement --;

		if ( currentElement < 0 ) currentElement = 0;

		select();

	}

	function moveDown() {

		const selectables = getSelectables();

		currentElement ++;

		if ( currentElement > selectables.length - 1 ) {

			currentElement = selectables.length - 1;

		}

		select();

	}

	// Gamepad controls enabling/disabling.
	// Only enabled when the user is in the menu and actively browsing it.

	elem.enable = function () {

		if ( !listening ) {

			engine.on( 'joystick-hit-up', () => {

				if ( handling ) moveUp();

			} );

			engine.on( 'joystick-hit-down', () => {

				if ( handling ) moveDown();

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
