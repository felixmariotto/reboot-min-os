
// KD tree

import * as THREE from 'three';

//

const MAX_CONTENT = 2; // max number of elements in the leaf nodes

const _vec = new THREE.Vector3();
const _box = new THREE.Box3();
const _box0 = new THREE.Box3();

//

export default function SpatialIndex() {

	function addShape( shape ) {

		this.shapes.push( shape );

	}

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

		this.root = this.Node( this.shapes, rootAABB );

	}

	// Node is a recursive factory function, it create sub-nodes until
	// the leaf nodes have a sufficiently small amount of content.

	function Node( shapes, baseAABB, level=0 ) {

		const node = Object.assign(
			Object.create( new THREE.Box3() ),
			{
				subNodes: [],
				level
			}
		);

		if ( baseAABB ) node.copy( baseAABB );

		// if more than MAX_CONTENT shapes are passed, we create sub-nodes

		if ( shapes.length > MAX_CONTENT ) {

			// determine the node longest axis

			_vec
			.copy( node.max )
			.sub( node.min )
			
			const longAxis = Object.keys( _vec ).sort( ( a, b ) => {

				return _vec[b] - _vec[a]

			} )[0];

			// sort the contained shapes along this axis

			const sorted = shapes.sort( ( a, b ) => {

				return a.center[ longAxis ] - b.center[ longAxis ]

			} );

			// separate in two groups and compute each group AABB

			const medianID = Math.ceil( ( shapes.length - 1 ) / 2 );

			const minShapes = sorted.slice( 0, medianID );
			const maxShapes = sorted.slice( medianID, shapes.length );

			const minAABB = _box;
			minAABB.min.setScalar( Infinity );
			minAABB.max.setScalar( -Infinity );

			const maxAABB = _box0;
			maxAABB.min.setScalar( Infinity );
			maxAABB.max.setScalar( -Infinity );

			minShapes.forEach( shape => minAABB.expandByObject( shape ) );
			maxShapes.forEach( shape => maxAABB.expandByObject( shape ) );

			// compute separating plane

			node.separatingPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ) );

			node.separatingPlane.normal[ longAxis ] = 1;

			// node.separatingPlane.constant = ( minAABB.max[ longAxis ] + maxAABB.min[ longAxis ] ) / 2;

			node.separatingPlane.constant = ( node.max[ longAxis ] + node.min[ longAxis ] ) / 2;

			/*
			console.log( 'minAABB', minAABB )
			console.log( 'maxAABB', maxAABB )
			console.log( 'node.separatingPlane', node.separatingPlane )
			debugger
			*/

			// compute subNodes bounding boxes

			minAABB.copy( node );
			maxAABB.copy( node );

			minAABB.max[ longAxis ] = node.separatingPlane.constant;
			maxAABB.min[ longAxis ] = node.separatingPlane.constant;

			// create sub nodes

			node.minNode = this.Node( minShapes, minAABB, node.level + 1 );
			node.maxNode = this.Node( maxShapes, maxAABB, node.level + 1 );

		} else {

			// this node is a leaf node,
			// so we look for shapes overlapping this node bounding box.

			node.isLeaf = true;

			node.shapes = [];

			this.shapes.forEach( (shape) => {

				if ( node.intersectsBox( shape.aabb ) ) {

					node.shapes.push( shape );

				}

			} );

			if ( !node.shapes.length ) {

				// console.log( 'bug: ', node )

				const helper = new THREE.Box3Helper( node, 0xff0000 );

				this.world.add( helper );

			} else {

				const helper = new THREE.Box3Helper( node, 0x00ff00 );

				this.world.add( helper );

			}

		}

		//

		return node

	}

	//

	return {
		shapes: [],
		addShape,
		computeTree,
		Node
	}

}