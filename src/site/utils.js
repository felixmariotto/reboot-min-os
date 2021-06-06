
// helper function to make dom element creation quicker

function elem( options ) {

	options = options || {};

	const tagName = options.tagName || 'DIV';

	const element = document.createElement( tagName );

	if ( options.id ) element.id = options.id;

	if ( options.html ) element.append( options.html );

	if ( options.classes ) element.classList.add( ...options.classes.split(' ') );

	if ( options.type ) element.type = options.type;

	return element

}

// designed to make using FontAwesome icons easier.
// pass it the string "fas fa-cube", it returns the icon.

function icon( classString ) {
	
	const domElement = elem({ type: 'I', classes: classString })

	return domElement

}

//

function elemFromHTML( htmlString ) {

	const div = document.createElement( 'div' );
	div.innerHTML = htmlString.trim();
	return div.firstChild;

}

//

function vertSpace( px ) {

	const div = document.createElement( 'div' );
	div.style.height = px + 'px';
	return div

}

//

export { elem }
export { icon }
export { elemFromHTML }
export { vertSpace }
export default {
	elem,
	icon,
	elemFromHTML,
	vertSpace
}
