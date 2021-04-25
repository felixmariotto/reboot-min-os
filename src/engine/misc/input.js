
import * as THREE from 'three';
import events from './events.js';

//

const api = {
	targetDirection: new THREE.Vector2(),
	jumpState: false,
	climbState: false
}

//

const arrowState = {
	up: false,
	down: false,
	right: false,
	left: false
};

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
			arrowState.e = true;
			computeButtonsState();
			break
		case 'Space' :
			arrowState.space = true;
			computeButtonsState();
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
		case 'KeyE' :
			arrowState.e = false;
			computeButtonsState();
			break
		case 'Space' :
			arrowState.space = false;
			computeButtonsState();
			break
	}

});

function computeTargetDir() {

	api.targetDirection.y = ( arrowState.up - arrowState.down );
	api.targetDirection.x = ( arrowState.right - arrowState.left );

	api.targetDirection.normalize();

}

function computeButtonsState() {

	if ( arrowState.space === true ) {

		api.jumpState = true;

	} else {

		api.jumpState = false;

	}

	if ( arrowState.e === true ) {

		api.climbState = true;

	} else {

		api.climbState = false;

	}

	events.emit( 'button-state-change', api );

}

//

export default api