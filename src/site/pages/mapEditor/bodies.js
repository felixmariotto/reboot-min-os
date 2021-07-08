
import { elem, icon } from '../../utils.js';
import Button from '../../components/button/Button.js';
import codeInput from '../../components/codeInput/codeInput.js';
import tagInput from '../../components/tagInput/tagInput.js';
import './bodies.css';
import shapes from './shapes.js';

//

const bodies = [];

let selectedBody = null;

const bodiesOptions = elem({ classes: 'tool-options' });

//

const toolBar = elem({ id: 'editor-bodies-toolbar' });

bodiesOptions.append( toolBar );

//

toolBar.append(
	makeTool( 'far fa-plus-square', addBody ),
	makeTool( 'far fa-trash-alt', deleteBody ),
	makeTool( 'fas fa-file-import', addToBody ),
	makeTool( 'fas fa-file-export', removeFromBody ),
	makeTool( 'fas fa-lightbulb-on', showBody ),
	makeTool( 'far fa-lightbulb', hideBody ),
	makeTool( 'fas fa-code', showCodeInput ),
	makeTool( 'fas fa-tags', showTagInput )
);

function makeTool( iconClasses, callback ) {

	const toolIcon = icon( iconClasses );

	const button = Button( toolIcon );

	button.onclick = () => callback();

	return button

}

//

const listContainer = elem({ id: 'editor-bodies-list-container' })
const bodiesList = elem({ id: 'editor-bodies-list' });


bodiesOptions.append( listContainer );
listContainer.append( bodiesList );

//

function selectBody( body ) {

	unselectedAll();

	body.domElement.classList.add( 'selected' );

	selectedBody = body;
}

function unselectedAll() {

	bodies.forEach( body => body.domElement.classList.remove( 'selected' ) );

	selectedBody = null;

}

function addBody() {

	const newBody = Body();

	bodies.push( newBody );

	bodiesList.append( newBody.domElement );

	newBody.domElement.onclick = () => { selectBody( newBody ) }

	selectBody( newBody );

}

function deleteBody() {

	if ( !selectedBody ) return

	if ( window.confirm( 'Are you sure to delete this body ?' ) ) {

		bodies.splice( bodies.indexOf( selectedBody ), 1 );

		selectedBody.clear();

		selectedBody = null;

	}

}

function addToBody( shape, body ) {

	const selShapes = shape ? [ shape ] : shapes.getSelected();
	body = body || selectedBody;
	if ( !body || !selShapes.length ) return

	selShapes.forEach( (shape) => {

		if ( shape.parent && !shape.parent.isTransformContainer ) {

			body.threeObj.attach( shape );

		}

	} );
	
	selShapes.forEach( shape => shape.owner = body );

	// update material according to body color

	if ( body.color ) {

		selShapes.forEach( shape => shape.material.color.set( body.color ) );

	}

}

function removeFromBody( shape ) {

	if ( shape && !shape.shapeType ) return

	const selShapes = shape ? [ shape ] : shapes.getSelected();

	if ( !selectedBody || !selShapes.length ) return

	selShapes.forEach( shape => shape.owner = undefined );

	engine.core.scene.attach( ...selShapes );

	selShapes.forEach( shape => shape.material = shapes.DefaultShapeMaterial() );

}

function showBody() {

	if ( !selectedBody ) return

	selectedBody.threeObj.visible = true;

}

function hideBody() {

	if ( !selectedBody ) return

	selectedBody.threeObj.visible = false;

}

//

function fromInfo( info ) {

	const newBody = Body( info.name );

	newBody.transformCode = info.trans;
	newBody.tags = info.tags;
	newBody.color = info.color || makeRandomColor();

	if ( info.trans ) {

		newBody.transformFunction = Function( 'time', 'isEnabled', info.trans );

	}

	bodies.push( newBody );

	bodiesList.append( newBody.domElement );

	newBody.domElement.onclick = () => { selectBody( newBody ) }

	newBody.domElement.style.backgroundColor = '#' + new engine.THREE.Color( newBody.color ).getHexString();
	newBody.domElement.style.color = 'black';

	info.shapes.forEach( (shapeInfo) => {

		addToBody( shapes.fromInfo( shapeInfo ), newBody );

	} );

}

//

function getFromName( name ) {

	return bodies.find( body => body.name === name );

}

//

function makeRandomColor() {

	const color = new engine.THREE.Color();

	color.r = 0.4 + ( Math.random() * 0.6 );
	color.g = 0.4 + ( Math.random() * 0.6 );
	color.b = 0.4 + ( Math.random() * 0.6 );

	return color

}

// TRANSFORMATION AND TAG CODE

function showTagInput() {

	if ( !selectedBody ) return

	window.addEventListener( 'keydown', handleEscapeTagInput );

	tagInput.toggle();
	tagInput.setContent( selectedBody.tags || '' );

}

function handleEscapeTagInput( e ) {

	if ( e.code === 'Escape' ) {

		tagInput.reset();
		tagInput.toggle();

		window.removeEventListener( 'keydown', handleEscapeTagInput );

	}

}

tagInput.addEventListener( 'validate', (e) => {

	const tags = e.detail;

	tagInput.reset();
	tagInput.toggle();

	if ( selectedBody ) selectedBody.tags = tags;

	window.removeEventListener( 'keydown', handleEscapeCodeInput );

} );

//

function showCodeInput() {

	if ( !selectedBody ) return

	window.addEventListener( 'keydown', handleEscapeCodeInput );

	codeInput.toggle();
	codeInput.setContent( selectedBody.transformCode );

}

function handleEscapeCodeInput( e ) {

	if ( e.code === 'Escape' ) {

		codeInput.reset();
		codeInput.toggle();

		window.removeEventListener( 'keydown', handleEscapeCodeInput );

	}

}

codeInput.addEventListener( 'validate', (e) => {

	const transformCode = e.detail;

	codeInput.reset();
	codeInput.toggle();

	if ( selectedBody ) {

		selectedBody.transformCode = transformCode;

		selectedBody.transformFunction = Function( 'time', 'isEnabled', transformCode );

	}

	window.removeEventListener( 'keydown', handleEscapeCodeInput );

} );

//

function Body( name ) {

	name = name || Math.random().toString(36).substring(8);

	const threeObj = new engine.THREE.Object3D();

	engine.core.scene.add( threeObj );

	const color = makeRandomColor();

	const domElement = elem({ classes: 'editor-body-line', html: name })

	domElement.style.backgroundColor = '#' + new engine.THREE.Color( color ).getHexString();
	domElement.style.color = 'black';

	//

	function clear() {

		this.domElement.remove();

		for ( let i = this.threeObj.children.length ; i>-1 ; i-- ) {

			removeFromBody( this.threeObj.children[i] );

		}

		this.threeObj.parent.remove( this.threeObj );

	}

	return {
		name,
		color,
		clear,
		threeObj,
		isBody: true,
		transformCode: null,
		domElement,
	}

}

//

export default {
	bodies,
	domOptions: bodiesOptions,
	fromInfo,
	getFromName
}
