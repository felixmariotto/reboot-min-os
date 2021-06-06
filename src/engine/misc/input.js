
import * as THREE from 'three';
import events from './events.js';

//

const api = {
	targetDirection: new THREE.Vector2(),
	targetCamDirection: new THREE.Vector2(),
	updateGamepadState
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

const newJoystickValues = new THREE.Vector2();

const gamepadButtonsState = {
	jump: false,
	pull: false,
	release: false,
	pause: false
};

function updateGamepadState() {

	const gamepads = navigator.getGamepads();

	if ( gamepads[0] ) {

		// MOVEMENT JOYSTICK

		newJoystickValues.x = -1 * gamepads[0].axes[0];
		newJoystickValues.y = -1 * gamepads[0].axes[1];

		if (
			newJoystickValues.x < 0.1 &&
			newJoystickValues.x > -0.1
		) {
			newJoystickValues.x = 0;
		}

		if (
			newJoystickValues.y < 0.1 &&
			newJoystickValues.y > -0.1
		) {
			newJoystickValues.y = 0;
		}

		// send events for the user interface
		if ( !api.targetDirection.y && newJoystickValues.y ) {
			
			if ( newJoystickValues.y > 0 ) {
				events.emit( 'joystick-hit-up' );
			} else {
				events.emit( 'joystick-hit-down' );
			}

		}

		api.targetDirection.x = newJoystickValues.x;
		api.targetDirection.y = newJoystickValues.y;

		// CAMERA JOYSTICK

		api.targetCamDirection.x = gamepads[0].axes[2];
		api.targetCamDirection.y = gamepads[0].axes[3];

		if (
			api.targetCamDirection.x < 0.1 &&
			api.targetCamDirection.x > -0.1
		) {
			api.targetCamDirection.x = 0;
		}

		if (
			api.targetCamDirection.y < 0.1 &&
			api.targetCamDirection.y > -0.1
		) {
			api.targetCamDirection.y = 0;
		}

		// BUTTONS
		// fire events on button press and wait after button release before firing again.

		if (
			gamepads[0].buttons[0].pressed ||
			gamepads[0].buttons[1].pressed
		) {

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

		//

		if (
			gamepads[0].buttons[8].pressed ||
			gamepads[0].buttons[9].pressed ||
			gamepads[0].buttons[16].pressed
		) {

			if ( !gamepadButtonsState.pause ) {

				events.emit( 'pause' );
				gamepadButtonsState.pause = true;

			}

		} else {

			gamepadButtonsState.pause = false;

		}

	}

}

//

export default api
