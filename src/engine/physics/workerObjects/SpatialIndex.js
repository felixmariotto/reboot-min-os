
/*

Binary tree utility to speed up collision detection with static bodies.
It is instantiated as a WorkerWorld property.

WorkerWorld.spatialIndex.computeTree() is called once all the shapes of a world
have been instantiated.

When an body is looking for intersections with static bodies, findNeighborsOf is called
for every shape of this body, which returns all the static shapes likely to be collided.

*/

import * as THREE from 'three';

//

const DEPTH = 8; // level of depth of the binary tree

const _vec = new THREE.Vector3();

//

export default function SpatialIndex() {

	return {
		shapes: [],
		addShape,
		computeTree,
		getShapesInAABB,
		Node,
		findNeighborsOf
	}

}

//

function addShape( shape ) {

	this.shapes.push( shape );

}

//

function computeTree() {

	// compute all shapes AABB so we can put them in containers

	this.shapes.forEach( (shape) => {

		shape.computeAABB();

		shape.center = shape.aabb.getCenter( new THREE.Vector3() );

	} );

	// create root node and start tree recursive creation

	const rootAABB = new THREE.Box3();

	rootAABB.min.setScalar( Infinity );
	rootAABB.max.setScalar( -Infinity );

	this.shapes.forEach( shape => rootAABB.expandByObject( shape ) );

	this.root = this.Node( rootAABB );

}

// Node is a recursive factory function, it create sub-nodes until
// the leaf nodes have a sufficiently small amount of content.

function Node( baseAABB, level=0 ) {

	const node = Object.assign(
		Object.create( new THREE.Box3() ),
		{
			subNodes: [],
			level,
			findSphereNeighbors
		}
	);

	if ( baseAABB ) node.copy( baseAABB );

	// continue subdividing the node until we reach DEPTH

	if ( level < DEPTH ) {

		// determine the node longest axis

		_vec
		.copy( node.max )
		.sub( node.min )
		
		const longAxis = Object.keys( _vec ).sort( ( a, b ) => {

			return _vec[b] - _vec[a]

		} )[0];

		// compute separating plane

		node.separatingPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ) );

		node.separatingPlane.normal[ longAxis ] = 1;

		node.separatingPlane.constant = ( node.max[ longAxis ] + node.min[ longAxis ] ) / -2;

		// compute subNodes bounding boxes

		const minAABB = new THREE.Box3().copy( node );
		const maxAABB = new THREE.Box3().copy( node );

		minAABB.max[ longAxis ] = node.separatingPlane.constant * -1;
		maxAABB.min[ longAxis ] = node.separatingPlane.constant * -1;

		// create sub nodes

		const shapesInMin = this.getShapesInAABB( minAABB );
		const shapesInMax = this.getShapesInAABB( maxAABB );

		if ( shapesInMin.length ) node.minNode = this.Node( minAABB, node.level + 1 );
		if ( shapesInMax.length ) node.maxNode = this.Node( maxAABB, node.level + 1 );

	} else {

		// this node is a leaf node,
		// so we look for shapes overlapping this node bounding box.

		node.isLeaf = true;

		node.shapes = this.getShapesInAABB( node );

		// const helper = new THREE.Box3Helper( node, 0xffff00 );
		// this.world.add( helper );

	}

	//

	return node

}

// Node class method

function findSphereNeighbors( worldPos, radius, targetSet ) {

	if ( !this.isLeaf ) {

		// get distance between the center of the sphere and
		// the plane separating the two sub-nodes

		const dist = this.separatingPlane.distanceToPoint( worldPos );

		// depending on the distance sign, we call this recursive function
		// on one side or the other in the binary tree.

		if (
			Math.sign( dist ) > 0 &&
			this.maxNode
		) {

			this.maxNode.findSphereNeighbors( worldPos, radius, targetSet );

		} else if ( this.minNode ) {

			this.minNode.findSphereNeighbors( worldPos, radius, targetSet );

		}

		// test if the sphere is ON the plane and the other side of
		// the binary tree should be checked as well.

		if ( Math.abs( dist ) < radius ) {

			if (
				Math.sign( dist ) > 0 &&
				this.minNode
			) {

				this.minNode.findSphereNeighbors( worldPos, radius, targetSet );

			} else if ( this.maxNode ) {

				this.maxNode.findSphereNeighbors( worldPos, radius, targetSet );

			}

		}

	} else {

		// add the content of this leaf node to the shape's neighbors list

		for ( let i=0 ; i<this.shapes.length ; i++ ) {

			targetSet.add( this.shapes[i] )

		}

	}

}

//

function getShapesInAABB( aabb ) {

	const containedShapes = [];

	this.shapes.forEach( (shape) => {

		if ( aabb.intersectsBox( shape.aabb ) ) {

			containedShapes.push( shape );

		}

	} );

	return containedShapes

}

// since in this project we only check dynamic sphere against other shape,
// we assume here that the passed shape is a sphere, and has a center and
// a radius.

function findNeighborsOf( shape ) {

	shape.neighbors.clear();

	_vec
	.copy( shape.position )
	.applyMatrix4( shape.matrixWorld );

	// recursive function, find neighbors in the whole binary tree.

	this.root.findSphereNeighbors( _vec, shape.radius, shape.neighbors );

}
