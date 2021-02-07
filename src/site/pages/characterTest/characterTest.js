
import { elem } from '../../utils.js';
import loadingBox from '../../components/loadingBox/loadingBox.js';
import mainChar from '../../../assets/mainChar.glb';

//

const gamePage = elem({ id:'main-game-page' });

//

gamePage.start = function start() {

	loadingBox.setUploadingState( 50 );

	engine.threeCore.init();

	engine.threeCore.camera.position.z += 5;

	engine.files.load( mainChar, (glb) => {

		glb.scene.traverse( (child) => {
			if ( child.material ) child.material = new engine.THREE.MeshNormalMaterial();
		})

		engine.threeCore.scene.add( glb.scene );

	} );

}

//

export default gamePage
