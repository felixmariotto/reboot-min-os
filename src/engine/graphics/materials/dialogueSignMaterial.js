
import * as THREE from 'three';

//

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
	vUv = uv;
	vNormal = normalMatrix * normal;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = `
varying vec3 vNormal;
varying vec2 vUv;

uniform float time;

void main() {

	vec3 baseColor = vec3( 1.0, 0.8, 0.4 );
	vec3 focusColor = vec3( 0.5, 1.0, 0.6 );

	float focusPower = 0.5 + 0.5 * sin( ( vUv.y * 10.0 ) + ( time * 5.0 ) );

	baseColor = mix( baseColor, focusColor, focusPower );

	baseColor *= 0.6 + 0.4 * abs( dot( normalize( vNormal ), vec3( 0, -1, 0 ) ) );

	gl_FragColor = vec4( baseColor, 1.0 );
}
`;

const uniforms = {
	time: { value: 0.5 }
};

const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	transparent: true
});

material.userData.update = function ( elapsedTime ) {
	material.uniforms.time.value = elapsedTime;
}

//

export default material
