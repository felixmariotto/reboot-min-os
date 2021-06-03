
import * as THREE from 'three';
import events from './events.js';
import core from '../core/core.js';

//

const api = {
	targetDirection: new THREE.Vector2(),
}

//

const arrowState = {
	up: false,
	down: false,
	right: false,
	left: false
};

/////////////
// KEYBOARD
/////////////

window.addEventListener( 'keydown', (e) => {

	switch ( e.code ) {
		case 'KeyW' :
			arrowState.up = true;
			computeTargetDir();
			break
		case 'KeyA' :
			arrowState.right = true;
			computeTargetDir();
			break
		case 'KeyS' :
			arrowState.down = true;
			computeTargetDir();
			break
		case 'KeyD' :
			arrowState.left = true;
			computeTargetDir();
			break
		case 'KeyE' :
			events.emit( 'pull-key-down' );
			break
		case 'KeyQ' :
			events.emit( 'release-key-down' );
			break
		case 'Space' :
			events.emit( 'jump-key-down' );
			break
	}

});

window.addEventListener( 'keyup', (e) => {

	switch ( e.code ) {
		case 'KeyW' :
			arrowState.up = false;
			computeTargetDir();
			break
		case 'KeyA' :
			arrowState.right = false;
			computeTargetDir();
			break
		case 'KeyS' :
			arrowState.down = false;
			computeTargetDir();
			break
		case 'KeyD' :
			arrowState.left = false;
			computeTargetDir();
			break
	}

} );

function computeTargetDir() {

	api.targetDirection.y = ( arrowState.up - arrowState.down );
	api.targetDirection.x = ( arrowState.right - arrowState.left );

	api.targetDirection.normalize();

}

////////////
// GAMEPAD
////////////

const gamepadButtonsState = {
	jump: false,
	pull: false,
	release: false
};

core.callInLoop( updateGamepadState );

function updateGamepadState() {

	const gamepads = navigator.getGamepads();

	if ( gamepads[0] ) {

		api.targetDirection.x = -1 * gamepads[0].axes[0];
		api.targetDirection.y = -1 * gamepads[0].axes[1];

		if (
			api.targetDirection.x < 0.1 &&
			api.targetDirection.x > -0.1
		) {
			api.targetDirection.x = 0;
		}

		if (
			api.targetDirection.y < 0.1 &&
			api.targetDirection.y > -0.1
		) {
			api.targetDirection.y = 0;
		}

		// fire events on button press and wait after button release before firing again.

		if ( gamepads[0].buttons[0].pressed ) {

			if ( !gamepadButtonsState.jump ) {

				events.emit( 'jump-key-down' );
				gamepadButtonsState.jump = true;

			}
			
		} else {

			gamepadButtonsState.jump = false;

		}

		//

		if ( gamepads[0].buttons[2].pressed ) {

			if ( !gamepadButtonsState.pull ) {

				events.emit( 'pull-key-down' );
				gamepadButtonsState.pull = true;

			}
			
		} else {

			gamepadButtonsState.pull = false;

		}

		//

		if ( gamepads[0].buttons[3].pressed ) {

			if ( !gamepadButtonsState.release ) {

				events.emit( 'release-key-down' );
				gamepadButtonsState.release = true;

			}
			
		} else {

			gamepadButtonsState.release = false;

		}

	}

}

//

export default api
