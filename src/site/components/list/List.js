
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

		if ( !selectables ) return

		selectables[ currentElement ].focus();

	}

	function click() {

		const selectables = getSelectables();

		if ( !selectables ) return

		selectables[ currentElement ].click();

		emitUpdates();

	}

	function getSelectables() {

		const children = Array.from( elem.children );

		return children.filter( e => e.isSelectable );

	}

	function emitUpdates() {

		const selectables = getSelectables();

		const params = {};

		selectables.forEach( (s) => {
			if ( s.getValue ) {
				const values = s.getValue();
				params[ values.name ] = values.value;
			}
		} );

		const event = new CustomEvent( 'update-values', { detail: params } );

		elem.dispatchEvent( event );

	}

	// Called on joystick hits up or down.
	// Move the focus across the list elements.

	function moveUp() {

		currentElement --;

		if ( currentElement < 0 ) currentElement = 0;

		focus();

	}

	function moveDown() {

		const selectables = getSelectables();

		if ( !selectables ) return

		currentElement ++;

		if ( currentElement > selectables.length - 1 ) {

			currentElement = selectables.length - 1;

		}

		focus();

	}

	// Used only to move the range input cursor

	function moveLeft() {

		const selectables = getSelectables();

		if ( !selectables ) return

		if ( selectables[ currentElement ].moveLeft ) {

			selectables[ currentElement ].moveLeft();

		}

		emitUpdates();

	}

	function moveRight() {
		
		const selectables = getSelectables();

		if ( !selectables ) return

		if ( selectables[ currentElement ].moveRight ) {

			selectables[ currentElement ].moveRight();

		}

		emitUpdates();

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

			engine.on( 'joystick-hit-right', () => {

				if ( handling ) moveRight();

			} );

			engine.on( 'joystick-hit-left', () => {

				if ( handling ) moveLeft();

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
