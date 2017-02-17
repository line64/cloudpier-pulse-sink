import sendMessage from './sendMessage';

import series from 'series';


export default async function (config, state, cmdParams) {
		
	let { bunyan, reefClient } = state,
		{ REEF_CHECKPOINT } = config,
		{ events } = cmdParams;

	try {

		let promises = events.map((event, index) => sendMessage(event, config, index));

		await series(promises);

		console.log("Success");
		
	} catch (err) {

		throw err;

	}

}
