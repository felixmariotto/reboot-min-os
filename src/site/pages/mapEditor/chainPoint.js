
import './chainPoint.css';
import { elem } from '../../utils.js';
import shapes from './shapes.js';

setTimeout( () => {
	shapes.createChainPoint();
}, 500 )

//

const chainPointOptions = elem({ id: 'editor-chain-point-options', classes: 'tool-options' });

//

export default {
	domOptions: chainPointOptions
}
