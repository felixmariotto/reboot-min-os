
import * as THREE from 'three';
import params from '../../params.js';
import Body from './Body.js';
import Sphere from './Sphere.js';
import constants from '../../misc/constants.js';

//

export default function Chain( length ) {

	function attachStartTo( body ) {



	}

	//

	function attachEndTo( body ) {



	}

	//

	function makeHelper() {

		this.spheres.forEach( sphereBody => sphereBody.children[0].makeHelper() );

	}
	
	//

	function resolve() {



	}

	//

	const linksNumber = Math.floor( length / params.chainPointDistance );

	const spheres = [];

	for ( let i=0 ; i<linksNumber ; i++ ) {

		const sphereShape = Sphere( params.chainSphereRadius );

		const sphereBody = Body( constants.DYNAMIC_BODY, 0.6 );

		sphereBody.add( sphereShape );

		spheres.push( sphereBody );

	}

	//

	return {
		length,
		linksNumber,
		spheres,
		attachStartTo,
		attachEndTo,
		makeHelper,
		resolve
	}

}