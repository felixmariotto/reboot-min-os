
// KD tree

import * as THREE from 'three';

//

const DEPTH = 8; // level of depth of the binary tree

const _vec = new THREE.Vector3();

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

		this.root = this.Node( rootAABB );

	}

	// Node is a recursive factory function, it create sub-nodes until
	// the leaf nodes have a sufficiently small amount of content.

	function Node( baseAABB, level=0 ) {

		const node = Object.assign(
			Object.create( new THREE.Box3() ),
			{
				subNodes: [],
				level
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

			node.separatingPlane.constant = ( node.max[ longAxis ] + node.min[ longAxis ] ) / 2;

			// compute subNodes bounding boxes

			const minAABB = new THREE.Box3().copy( node );
			const maxAABB = new THREE.Box3().copy( node );

			minAABB.max[ longAxis ] = node.separatingPlane.constant;
			maxAABB.min[ longAxis ] = node.separatingPlane.constant;

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

	//

	return {
		shapes: [],
		addShape,
		computeTree,
		getShapesInAABB,
		Node
	}

}