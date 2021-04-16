
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import mainChar from '../../../assets/main_char.glb';
import uvGrid from '../../../assets/uv_grid.jpg';

//

const gamePage = elem({ id:'character-test-page', classes: 'game-container' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.core.init( gamePage );

	engine.files.load( uvGrid, (texture) => {

		const planeMaterial = new engine.THREE.MeshBasicMaterial({
			map: texture
		});

		const plane = new engine.THREE.Mesh(
			new engine.THREE.PlaneBufferGeometry(),
			planeMaterial
		);

		plane.scale.setScalar( 20 );
		plane.rotation.x = -Math.PI / 2;

		engine.core.scene.add( plane );

	} )

	engine.files.load( mainChar, (glb) => {

		glb.scene.traverse( (child) => {
			if ( child.material ) child.material = engine.materials.characterMaterial;
		})

		engine.core.scene.add( glb.scene );

		engine.cameraControls.orbitObj( glb.scene );

		engine.characterControls.control( glb.scene );

	} );

}

//

export default gamePage
