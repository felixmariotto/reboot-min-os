
import * as THREE from 'three';
import events from './events.js';

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

//

export default api
