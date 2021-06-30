
export default {

	easeInQuad: (x) => {
		return x * x;
	},

	easeOutQuad: (x) => {
		return 1 - ( 1 - x ) * ( 1 - x );
	}
	
}
