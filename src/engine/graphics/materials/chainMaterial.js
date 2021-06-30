
import * as THREE from 'three';

//

const material = new THREE.MeshStandardMaterial({
	roughness: 0.1,
	metalness: 1.0
});

material.onBeforeCompile = function ( shader ) {

	shader.uniforms.time = { value: 0 };

	shader.fragmentShader = 'uniform float time;\n' + shader.fragmentShader;

	shader.fragmentShader = shader.fragmentShader.replace(
		'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
		'gl_FragColor = vec4( sin( time ), 0.0, 0.0, 1.0 );'
	)

	material.userData.uniforms = shader.uniforms;

	console.log( shader.fragmentShader )

}

material.userData.update = function ( elapsedTime ) {

	if ( material.userData.uniforms ) {

		material.userData.uniforms.time.value = elapsedTime;
		
	}

}

//

export default material
