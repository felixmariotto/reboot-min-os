
// helper function to make dom element creation quicker

function elem( options ) {

	options = options || {};

	const tagName = options.tagName || 'DIV';

	const element = document.createElement( tagName );

	if ( options.id ) element.id = options.id;

	if ( options.html ) element.append( options.html );

	if ( options.classes ) element.classList.add( ...options.classes.split(' ') );

	return element

}

// designed to make using FontAwesome icons easier.
// pass it the string "fas fa-cube", it returns the icon.

function icon( classString ) {
	
	const domElement = elem({ type: 'I', classes: classString })

	return domElement

}

//

export { elem }
export { icon }
export default {
	elem,
	icon
}
