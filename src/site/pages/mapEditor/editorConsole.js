
import './editorConsole.css';
import { elem } from '../../utils.js';

//

const editorConsole = elem({ id: 'editor-console', classes: 'ui-panel' });

//

editorConsole.log = text => print( text, "white" );
editorConsole.warn = text => print( text, "yellow" );
editorConsole.error = text => print( text, "red" );

function print( text, color ) {

	const line = elem({ html: text });
	line.style.color = color;

	editorConsole.append( line );

}

//

export default editorConsole
