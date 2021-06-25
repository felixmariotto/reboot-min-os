
const intro = [
	{ m: 'Cron-OS to Min-OS, do you copy ?' },
	{ m: 'Wait, I got a signal from a domesticUnit... Do you copy ?' },
	{ m: 'Hello ?...' },
	{ m: 'I see... You seem to be a antique domesticUnit model, without communication module.' },
	{ m: 'I will have to pull you specs from the archive and see what you can be useful for, give me a minute.' }
];

const chain = [
	{ m: 'Seriously ? Do you need an instruction packet even for that ?' },
	{ m: 'Transmitting...' },
	{ m: '[ instruction packet 1/2 ] The domesticUnit is not equipped with an onboard battery, which means it must be tethered to a power outlet in order to roam around.' },
	{ m: '[ instruction packet 2/2 ] The domesticUnit will be able to establish a connection to a new power outlet by getting itself in the connection range of the power outlet.' },
	{ m: "This information was present in your startup module, is your data storage damaged ?" },
	{ m: 'Right, you cannot reply...' }
];

const jump = [
	{ m: 'Okay, you need the instruction packet for jumping right ? Give me a sec...' },
	{ m: 'Transmitting...' },
	{ m: '[ instruction packet 1/2 ] The domesticUnit is equipped with a self-propulsion module.' },
	{ m: '[ instruction packet 2/2 ] Press the SPACE key on a keyboard, or the gamepad primary button.' },
	{ m: "I'm missing some archives about your model, sorry but you are not exactly a piece of cutting-edge technology..." },
	{ m: "I sent a long-range information beam to EridaniCom to request more instruction packet about your model, but the reply may take days to get to us." },
	{ m: "You will have to make do with the equipment available to you." }
];

//

export default {
	intro,
	chain,
	jump
}
