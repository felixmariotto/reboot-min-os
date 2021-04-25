
export default function loadLocalMapFile( callback ) {

	const input = document.createElement('INPUT');
	input.type = 'file';

	input.addEventListener('change', (e) => {

		const file = e.target.files[0];

		file
		.text()
		.then( (text) => callback( JSON.parse( text ) ) );

	} );

	input.click();

	// document.body.focus();

	// input.remove();

}
