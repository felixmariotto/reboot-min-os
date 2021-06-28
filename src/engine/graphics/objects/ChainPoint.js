
import * as THREE from 'three';
import * as ThreeMeshUI from 'three-mesh-ui';
import core from '../../core/core.js';

//

const chainPoints = [];

core.callInLoop( updateChainPoints );

function updateChainPoints( delta ) {

	chainPoints.forEach( cp => cp.update( delta ) );

}

//

export default function ChainPoint( radius, length ) {

	const chainPoint = Object.assign(
		Object.create( new THREE.Group() ),
		{
			radius,
			length,
			init,
			update
		}
	);

	chainPoint.init();

	//

	return chainPoint

}

//

function init() {

	const geometry = new THREE.IcosahedronGeometry( this.radius, 3 );

	const material = new THREE.MeshNormalMaterial({ wireframe: true });

	const mesh = new THREE.Mesh( geometry, material );

	//

	const message = new ThreeMeshUI.Block({
		width: 2,
		height: 2,
		borderRadius: 1,
		justifyContent: 'center',
		fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
		fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png'
	});

	message.add(

		new ThreeMeshUI.Text({
			content: String( this.length ),
			fontSize: 0.7
		})

	);

	message.position.y += 2;

	//

	this.add( mesh, message );

	chainPoints.push( this );

}

//

function update( delta ) {

	this.quaternion.copy( core.camera.quaternion );

}
