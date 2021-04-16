
import { elem, icon } from '../../utils.js';
import './shapes.css';

//

const shapes = [];

const shapesOptions = elem({ id: 'editor-shapes-options', classes: 'tool-options' });

shapesOptions.append('shapes options')

//

export default {
	shapes,
	domOptions: shapesOptions
}