
import stories from './stories.js';

//

const intro = {
	template: 'narrative',
	story: stories.intro
};

const chain = {
	template: 'narrative',
	story: stories.chain
};

const jump = {
	template: 'narrative',
	story: stories.jump
};

const energy = {
	template: 'narrative',
	story: stories.energy
}

const unlockMeadow = {
	template: 'narrative',
	story: stories.unlockMeadow
}

//

export default {
	intro,
	chain,
	jump,
	energy,
	unlockMeadow
}
