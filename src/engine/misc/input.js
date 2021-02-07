
import * as THREE from 'three';

//

const targetDirection = new THREE.Vector2();

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
	}

});

function computeTargetDir() {

	targetDirection.y = ( arrowState.up - arrowState.down );
	targetDirection.x = ( arrowState.right - arrowState.left );

	targetDirection.normalize();

}

//

export default {
	targetDirection
}