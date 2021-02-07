
import * as THREE from 'three';
import params from '../params.js';

//

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.domElement.style.height = '100vh';
renderer.domElement.style.width = '100vw';

const camera = new THREE.PerspectiveCamera(
	params.cameraFOV,
	1,
	params.cameraNear,
	params.cameraFar
);

//

function init() {

	document.body.innerHTML = '';

	document.body.append( renderer.domElement );

}

//

function resize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

export default {
	init
}
