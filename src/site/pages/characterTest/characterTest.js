
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';

import mainChar from '../../../assets/mainChar.glb';
import uvGrid from '../../../assets/uv_grid.jpg';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.threeCore.init();

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

		engine.threeCore.scene.add( plane );

	} )

	engine.files.load( mainChar, (glb) => {

		glb.scene.traverse( (child) => {
			if ( child.material ) child.material = new engine.THREE.MeshNormalMaterial();
		})

		engine.threeCore.scene.add( glb.scene );

		// engine.cameraControls.followObj( glb.scene );
		engine.cameraControls.orbitObj( glb.scene );

		engine.characterControls.control( glb.scene );

	} );

}

//

export default gamePage
