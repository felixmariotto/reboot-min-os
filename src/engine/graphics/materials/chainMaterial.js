
import * as THREE from 'three';

//

const material = new THREE.MeshStandardMaterial({
	roughness: 0.1,
	metalness: 1.0
});

material.onBeforeCompile = function ( shader ) {

	// VERTEX

	shader.vertexShader = `

	attribute float idx;

	varying float vIdx;

	varying vec2 vUv;

	` + shader.vertexShader;

	//

	shader.vertexShader = shader.vertexShader.replace(

		'vViewPosition = - mvPosition.xyz;',

		//

		`

		vViewPosition = - mvPosition.xyz;

		vIdx = idx;

		vUv = uv;

		`
	);

	// FRAGMENT

	shader.fragmentShader = shader.fragmentShader.replace(

		'void main()',

		//

		`
		uniform float time;

		varying float vIdx;

		varying vec2 vUv;

		vec2 getMatcapUV() {
			vec3 normal = normalize( vNormal );
			vec3 viewDir = normalize( vViewPosition );
			vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
			vec3 y = cross( viewDir, x );
			return vec2( dot( x, normal ), dot( y, normal ) ) * 0.497 + 0.5;
		}

		void main()

		`
	);

	//

	shader.fragmentShader = shader.fragmentShader.replace(

		'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',

		//

		`

		vec2 matcapUV = getMatcapUV();

	  	matcapUV -= 0.5;

	    matcapUV *= 2.0;

	    float centerDist = length( matcapUV );

	    centerDist *= 1.0 + 0.5 * sin( time * 10.0 - vIdx ) * 1.2;

	    vec3 color = mix( vec3( 1.0 ), outgoingLight, centerDist );

	    gl_FragColor = vec4( color, 1 );

		`
	)

	shader.uniforms.time = { value: 0 };
	material.userData.uniforms = shader.uniforms;

}

material.userData.update = function ( elapsedTime ) {

	if ( material.userData.uniforms ) {

		material.userData.uniforms.time.value = elapsedTime;
		
	}

}

//

export default material
