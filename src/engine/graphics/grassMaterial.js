
import * as THREE from 'three';

//

const vertexShader = `
	varying vec2 vUv;
	uniform float time;

	void main() {

	vUv = uv;

	// VERTEX POSITION

	vec4 mvPosition = vec4( position, 1.0 );
	#ifdef USE_INSTANCING
		mvPosition = instanceMatrix * mvPosition;
	#endif

	// DISPLACEMENT

	// here the displacement is made stronger on the blades tips.
	float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );

	float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
	mvPosition.z += displacement;

	//

	vec4 modelViewPosition = modelViewMatrix * mvPosition;
	gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
	varying vec2 vUv;

	void main() {
	vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
	float clarity = ( vUv.y * 0.5 ) + 0.5;
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
