
import * as THREE from 'three';
import params from '../../params.js';
import Body from './Body.js';
import Sphere from './Sphere.js';
import constants from '../../misc/constants.js';

//

const _vec = new THREE.Vector3();

//

export default function Chain( length ) {

	function attachStartTo( body, x, y, z ) {

		body.chain = this;

		this.start = {
			body,
			point: new THREE.Vector3( x, y, z )
		};

		this.initChainPos();

	}

	//

	function attachEndTo( body, x, y, z ) {

		body.chain = this;

		this.end = {
			body,
			point: new THREE.Vector3( x, y, z )
		};

		this.initChainPos();

	}

	//

	function makeHelper() {

		this.hasHelpers = true;

		this.spheres.forEach( sphereBody => sphereBody.children[0].makeHelper() );

	}
	
	//

	function initChainPos() {

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
				this.startPoint,
				this.endPoint,
				i / this.spheresNumber
			);

		}

	}

	//

	function resolve() {

		for ( let i=0 ; i<params.chainPasses ; i++ ) {

			this.computeEndStart();

			for ( let j=0 ; j<this.pointsNumber - 1 ; j++ ) {

				const p1 = this.points[ j ];
				const p2 = this.points[ j + 1 ];
				const sphere1 = !j ? null : this.spheres[ j - 1 ];
				const sphere2 = j === this.pointsNumber - 2 ? null : this.spheres[ j ];

				const diff = this.constrainPoints( p1, p2 );

				// add/subtract the diff to the velocity of each chain sphere

				if ( !( sphere1 && sphere1.isBlocked ) ) p1.sub( diff );
				if ( !( sphere2 && sphere2.isBlocked ) ) p2.add( diff );

				if ( sphere1 && !sphere1.isBlocked ) sphere1.velocity.sub( diff );
				if ( sphere2 && !sphere2.isBlocked ) sphere2.velocity.add( diff );

				// transform body at the end of the chain

				if (
					j === this.pointsNumber - 2 &&
					// if the player is suspended on a middle link, we make the link
					// before the last uneffectual on the player
					!this.end.body.currentLink
				) {
					this.end.body.position.addScaledVector( diff, params.chainWeightOnPlayer );
					this.end.body.velocity.addScaledVector( diff, params.chainWeightOnPlayer );
				}

			}
			
		}

	}

	//

	function constrainPoints( p1, p2 ) {

		// get the distance between the points

		const diff = _vec
		.copy( p2 )
		.sub( p1 );

		const distance = diff.length();

		// get the fractional distance the points need to move toward or away from center of 
		// line to make line length correct

		const fraction = ( ( this.linkLength - distance ) / distance ) / 2; // divide by 2 as each point moves half the distance
		diff.multiplyScalar( fraction );

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

	function constrainLinkTo( pointID, constrainedBody ) {

		const p1 = this.points[ pointID ];
		const p2 = constrainedBody.position;

		const diff = this.constrainPoints( p1, p2 );

		p1.sub( diff );
		p2.add( diff );

		// add the diff to the velocity of the particular link

		const sphere1 = !pointID ? null : this.spheres[ pointID - 1 ];

		if ( sphere1 ) sphere1.velocity.sub( diff );

		// transform constrained body

		this.end.body.position.addScaledVector( diff, params.chainWeight );
			
		this.end.body.velocity.addScaledVector( diff, params.chainWeight );

	}

	//

	function isAttachedTo( chainPoint ) {

		return (
			this.start &&
			this.end &&
			(
				this.start.body === chainPoint ||
				this.end.body === chainPoint
			)
		)

	}

	//

	function clear() {

		if ( this.start ) this.start.body.chain = undefined;
		if ( this.end ) this.end.body.chain = undefined;

		this.spheres.forEach( sphere => sphere.clear() );

	}

	//

	function addLength( lengthToAdd ) {

		this.length += lengthToAdd;

		this.pointsNumber = Math.floor( this.length / params.chainPointDistance );

		this.linkLength = this.length / ( this.pointsNumber - 1 );

		const newSpheresNumber = Math.max( 0, this.pointsNumber - 2 );

		const spheresToAdd = newSpheresNumber - this.spheresNumber;

		this.spheresNumber = newSpheresNumber;

		for ( let i=0 ; i<spheresToAdd ; i++ ) {

			const sphereShape = Sphere( params.chainSphereRadius );

			const sphereBody = Body(
				constants.DYNAMIC_BODY,
				params.chainWeight,
				params.chainMass
			);

			sphereBody.isChainLink = true;

			sphereBody.add( sphereShape );
			this.spheres[0].parent.add( sphereBody );

			this.spheres.splice( 1, 0, sphereBody );
			this.points.splice( 2, 0, sphereBody.position );

			if ( this.hasHelpers ) {

				sphereBody.children[0].makeHelper()

			}

			sphereBody.position.lerpVectors( this.points[1], this.points[3], 0.5 );

		}

	}

	//

	function init( length ) {

		this.length = length;

		this.pointsNumber = Math.floor( this.length / params.chainPointDistance );

		this.linkLength = this.length / ( this.pointsNumber - 1 );

		this.spheresNumber = Math.max( 0, this.pointsNumber - 2 );

		this.spheres = [];

		for ( let i=0 ; i<this.spheresNumber ; i++ ) {

			const sphereShape = Sphere( params.chainSphereRadius );

			const sphereBody = Body(
				constants.DYNAMIC_BODY,
				params.chainWeight,
				params.chainMass
			);

			sphereBody.isChainLink = true;

			sphereBody.add( sphereShape );

			this.spheres.push( sphereBody );

		}

		this.startPoint = new THREE.Vector3();
		this.endPoint = new THREE.Vector3();

		this.points = [ this.startPoint ];
		this.points.push( ...this.spheres.map( sphereBody => sphereBody.position ) );
		this.points.push( this.endPoint );

	}

	//

	const chain = {
		attachStartTo,
		attachEndTo,
		makeHelper,
		resolve,
		initChainPos,
		computeEndStart,
		constrainPoints,
		constrainLinkTo,
		isAttachedTo,
		clear,
		addLength,
		init
	}

	chain.init( length );

	return chain

}
