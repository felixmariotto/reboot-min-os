
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

void main() {

	vec4 edgeColor = vec4( 1.0 );
	vec4 centerColor = vec4( 3.0/255.0, 252.0/255.0, 215.0/255.0, 0.5 );

	vec3 normal = normalize( vNormal );

	float dotNormalCam = dot( normal, vec3( 0, 0, 1 ) );
	float stepNormal = step( 0.5, dotNormalCam );

	gl_FragColor = mix( edgeColor, centerColor, stepNormal );
}
`;

const uniforms = {};

const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	transparent: true
});

//

export default material
