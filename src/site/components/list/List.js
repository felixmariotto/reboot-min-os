
// List element designed to be controlable with a gamepad.
// When calling element.enable(), the element is listening for
// gamepad inputs.

export default function List() {

	let listening, handling;
	let currentElement = 0;

	const elem = document.createElement('DIV');

	//

	function focus() {

		const selectables = getSelectables();

		selectables[ currentElement ].focus();

		console.log( selectables[ currentElement ] )

	}

	function click() {

		const selectables = getSelectables();

		selectables[ currentElement ].click();

	}

	function getSelectables() {

		const children = Array.from( elem.children );

		return children.filter( e => e.isSelectable );

	}

	// Called on joystick hits up or down.

	function moveUp() {

		currentElement --;

		if ( currentElement < 0 ) currentElement = 0;

		focus();

	}

	function moveDown() {

		const selectables = getSelectables();

		currentElement ++;

		if ( currentElement > selectables.length - 1 ) {

			currentElement = selectables.length - 1;

		}

		focus();

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

			engine.on( 'jump-key-down', () => {

				if ( handling ) click();

			} );

			engine.on( 'pull-key-down', () => {

				if ( handling ) click();

			} );

			engine.on( 'release-key-down', () => {

				if ( handling ) click();

			} );

			listening = true;

		}

		focus();

		// timeout to prevent click events to be listened right when this
		// list was enabled.
		setTimeout( () => {

			handling = true;

		}, 0 )
		
	}

	elem.disable = function () {

		handling = false;

	}

	return elem

}
