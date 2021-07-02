
import * as THREE from 'three';
import shaderUtils from './shaderUtils.js';

//

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
	vUv = uv;
	vNormal = normalMatrix * normal;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	vViewPosition = ( modelViewMatrix * vec4( position, 1.0 ) ).rgb;
}
`;

const fragmentShader = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;

uniform float time;

${ shaderUtils.easeInQuad }

vec2 getMatcapUV() {
	vec3 normal = normalize( vNormal );
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	return vec2( dot( x, normal ), dot( y, normal ) ) * 0.497 + 0.5;
}

void main() {

	vec2 matcapUV = getMatcapUV();

	float centerDist = length( 1.0 - 2.0 * matcapUV );

	centerDist = easeInQuad( centerDist ) - 0.4;

	gl_FragColor = vec4( vec3( 1.0, 0, 0 ), centerDist );
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
