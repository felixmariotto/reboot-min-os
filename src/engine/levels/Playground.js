
import files from '../files/files.js';
import Level from './Level.js';

//

export default function Playground() {

	const level = Object.assign(
		Level(),
		{
			mapFile: files.maps.playground,
			staticModel: files.models.playgroundStaticModel
		}
	);

	//

	level.start();

	//

	return level

};