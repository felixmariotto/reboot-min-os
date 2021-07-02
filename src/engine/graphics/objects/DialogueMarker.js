
import * as THREE from 'three';
import core from '../../core/core.js';
import files from '../../files/files.js';
import materials from '../materials.js';

//

const dialogueMarkers = [];

core.callInLoop( updateMarkers );

function updateMarkers( delta ) {

	dialogueMarkers.forEach( cp => cp.update( delta ) );

}

//

export default function DialogueMarker() {

	const dialogueMarker = Object.assign(
		Object.create( new THREE.Group() ),
		{
			init,
			update
		}
	);

	dialogueMarker.init();

	//

	return dialogueMarker

}

//

function init() {

	const group = new THREE.Group();

	group.name = 'dialogue-marker';

	this.add( group );

	dialogueMarkers.push( this );

	// SIGN

	files.models.dialogueSign.then( model => {

		model.traverse( child => {

			if ( child.isMesh ) child.material = materials.dialogueSignMaterial;

		} )

		model.scale.setScalar( 0.17 );

		group.add( model )

	} );

	// SPHERE

	const geometry = new THREE.IcosahedronGeometry( 1.4, 3 );

	const mesh = new THREE.Mesh( geometry, materials.dialogueSphereMaterial );

	group.add( mesh );

}

//

function update( delta ) {

	this.rotation.y += delta;

}
