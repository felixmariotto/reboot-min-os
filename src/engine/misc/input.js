
import * as THREE from 'three';

//

const api = {
	targetDirection: new THREE.Vector2(),
	jumpState: false,
	actionState: false
}

//

const arrowState = {
	up: 0,
	down: 0,
	right: 0,
	left: 0
};

window.addEventListener( 'keydown', (e) => {

	switch ( e.code ) {
		case 'KeyW' :
			arrowState.up = 1;
			computeTargetDir();
			break
		case 'KeyA' :
			arrowState.right = 1;
			computeTargetDir();
			break
		case 'KeyS' :
			arrowState.down = 1;
			computeTargetDir();
			break
		case 'KeyD' :
			arrowState.left = 1;
			computeTargetDir();
			break
		case 'Space' :
			arrowState.space = 1;
			computeButtonsState();
			break
	}

});

window.addEventListener( 'keyup', (e) => {

	switch ( e.code ) {
		case 'KeyW' :
			arrowState.up = 0;
			computeTargetDir();
			break
		case 'KeyA' :
			arrowState.right = 0;
			computeTargetDir();
			break
		case 'KeyS' :
			arrowState.down = 0;
			computeTargetDir();
			break
		case 'KeyD' :
			arrowState.left = 0;
			computeTargetDir();
			break
		case 'Space' :
			arrowState.space = 0;
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

	if ( arrowState.space === 1 ) {

		api.jumpState = true;

	} else {

		api.jumpState = false;

	}

}

//

export default api