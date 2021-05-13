
import * as THREE from 'three';

//

export default function WorkerWorld( info ) {

	// console.log( info )

	const typedArr = new Float32Array( info.serialCounter * 3 );

	return {
		typedArr,
		info,
		update
	}

}

//

function update( delta ) {

	this.typedArr.fill( Math.sin( Date.now() / 300 ) * 10 )

	// this.typedArr = Math.sin( Date.now() / 300 ) * 10

	// console.log( delta );

}