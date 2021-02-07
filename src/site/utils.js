
function elem( options ) {

	const tagName = options.tagName || 'DIV';

	const element = document.createElement( tagName );

	if ( options.id ) element.id = options.id;

	return element

}

//

export { elem }
export default {
	elem
}