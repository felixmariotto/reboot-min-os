
import * as THREE from 'three';

import shaderUtils from './shaderUtils.js';

//

const vertexShader = `
	varying vec2 vUv;
	uniform float time;

	${ shaderUtils.simpleNoise }

	void main() {

		vUv = uv;
		float t = time * 2.;

		// VERTEX POSITION

		vec4 mvPosition = vec4( position, 1.0 );
		#ifdef USE_INSTANCING
			mvPosition = instanceMatrix * mvPosition;
		#endif

		// DISPLACEMENT

		float noise = smoothNoise( mvPosition.xz * 0.5 + vec2(0., t) );
		noise = pow( noise * 0.5 + 0.5, 2. ) * 2.;

		// here the displacement is made stronger on the blades tips.
		float dispPower = 1. - cos( ( 1.0 - uv.y ) * 3.1416 * 0.5 );

		float displacement = noise * ( 0.3 * dispPower );
		mvPosition.z -= displacement;

		//

		vec4 modelViewPosition = modelViewMatrix * mvPosition;
		gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
	varying vec2 vUv;

	void main() {
		vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
		float clarity = 1.0 - ( vUv.y * 0.5 );
		gl_FragColor = vec4( baseColor * clarity, 1 );
	}
`;

const uniforms = {
	time: {
		value: 0
	}
}

const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	side: THREE.DoubleSide
});

material.userData.update = function ( elapsedTime ) {
	material.uniforms.time.value = elapsedTime;
}

//

export default material
