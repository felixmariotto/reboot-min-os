
import * as THREE from 'three';

//

function boxBox( box1, box2, targetVec ) {

	// transform corners of boxes according to their matrices

	box1.updateMatrix();

	box1.vectors.forEach( vector => vector.applyMatrix4( box1.matrix ) );

	box2.updateMatrix();

	box2.vectors.forEach( vector => vector.applyMatrix4( box2.matrix ) );

	// console.log( box2.vectors );

	// debugger

	return targetVec

}

//

export default {
	boxBox
}