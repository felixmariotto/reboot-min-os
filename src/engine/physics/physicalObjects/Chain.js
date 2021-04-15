
import * as THREE from 'three';
import params from '../../params.js';
import Body from './Body.js';
import Sphere from './Sphere.js';
import constants from '../../misc/constants.js';

//

const _vec0 = new THREE.Vector3();
const _vec1 = new THREE.Vector3();

//

export default function Chain( length ) {

	function attachStartTo( body, x, y, z ) {

		this.start = {
			body,
			point: new THREE.Vector3( x, y, z )
		};

		this.init();

	}

	//

	function attachEndTo( body, x, y, z ) {

		this.end = {
			body,
			point: new THREE.Vector3( x, y, z )
		};

		this.init();

	}

	//

	function makeHelper() {

		this.spheres.forEach( sphereBody => sphereBody.children[0].makeHelper() );

	}
	
	//

	function init() {

		if (
			!this.start ||
			!this.end ||
			!this.spheresNumber
		) {
			return
		}

		this.computeEndStart();

		for ( let i=0 ; i<this.spheresNumber ; i++ ) {

			this.spheres[i].position.lerpVectors(
				this.start.point,
				this.end.point,
				i / this.spheresNumber
			);

		}

	}

	//

	function resolve() {

		if ( !this.start || !this.end ) {
			console.warn( 'chain.resolve : start or end is missing for resolution' );
		};

		for ( let i=0 ; i<params.chainPasses ; i++ ) {

			this.computeEndStart();

			for ( let j=0 ; j<this.pointsNumber - 1 ; j++ ) {

				const p1 = this.points[ j ];
				const p2 = this.points[ j + 1 ];

				const diff = this.constrainPoints( p1, p2 );

				// add the diff to the velocity of each chain sphere

				const sphere1 = !j ? null : this.spheres[ j - 1 ];
				const sphere2 = j === this.pointsNumber - 2 ? null : this.spheres[ j ];

				if ( sphere1 ) sphere1.velocity.sub( diff );
				if ( sphere2 ) sphere2.velocity.add( diff );

				/*
				if ( j > 0 && j < this.pointsNumber - 2 ) {

					const sphere1 = this.spheres[ j - 1 ];
					const sphere2 = this.spheres[ j ];

					sphere1.velocity.sub( diff );
					sphere2.velocity.add( diff );

				}
				*/

			}
			
		}

	}

	//

	function constrainPoints( p1, p2 ) {

		// get the distance between the points

		const diff = _vec0
		.copy( p2 )
		.sub( p1 );

		const distance = diff.length();

		// get the fractional distance the points need to move toward or away from center of 
		// line to make line length correct

		const fraction = ( ( this.linkLength - distance ) / distance ) / 2; // divide by 2 as each point moves half the distance

		//

		diff.multiplyScalar( fraction );
		p1.sub( diff );
		p2.add( diff );

		//

		return diff

	}

	//

	function computeEndStart() {

		this.start.body.updateMatrixWorld();
		this.end.body.updateMatrixWorld();

		this.startPoint
		.copy( this.start.point )
		.applyMatrix4( this.start.body.matrixWorld );

		this.endPoint
		.copy( this.end.point )
		.applyMatrix4( this.end.body.matrixWorld );

	}

	//

	const pointsNumber = Math.floor( length / params.chainPointDistance );

	const spheresNumber = Math.max( 0, pointsNumber - 2 );

	const spheres = [];

	for ( let i=0 ; i<spheresNumber ; i++ ) {

		const sphereShape = Sphere( params.chainSphereRadius );

		const sphereBody = Body( constants.DYNAMIC_BODY, 0.6 );

		sphereBody.add( sphereShape );

		spheres.push( sphereBody );

	}

	const startPoint = new THREE.Vector3();
	const endPoint = new THREE.Vector3();

	const points = [ startPoint ];
	points.push( ...spheres.map( sphereBody => sphereBody.position ) );
	points.push( endPoint );

	// test
	window.printPoints = function () {
		console.log( points );
	}

	window.printVelocities = function () {
		spheres.forEach( sphereBody => console.log( sphereBody.velocity ) )
	}

	//

	return {
		length,
		linkLength: length / ( pointsNumber - 1 ),
		pointsNumber,
		spheresNumber,
		spheres,
		points,
		startPoint, // in world space
		endPoint, // in world space
		attachStartTo,
		attachEndTo,
		makeHelper,
		resolve,
		init,
		computeEndStart,
		constrainPoints
	}

}