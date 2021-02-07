
function elem( options ) {

	const tagName = options.tagName || 'DIV';

	const element = document.createElement( tagName );

	if ( options.id ) element.id = options.id;

	if ( options.html ) element.append( options.html );

	if ( options.classes ) element.classList.add( ...options.classes.split(' ') );

	return element

}

//

export { elem }
export default {
	elem
}
