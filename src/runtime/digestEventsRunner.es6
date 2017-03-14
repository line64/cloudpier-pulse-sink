import sendMessage from './sendMessage';

export default async function (config, state, cmdParams) {
		
	let { bunyan, reefClient } = state,
		{ REEF_CHECKPOINT } = config,
		{ events } = cmdParams,
		totalSuccessfullySent = 0;

	bunyan.info('processing [DIGEST_EVENTS] command', cmdParams);

	try {

		bunyan.info('mapping events to slack messages');

		let promises = events.map(event => sendMessage(event, config, state));

		promises.forEach(async (promise) => {
			try {
				await promise;
				totalSuccessfullySent += 1;				
			} catch (err) {
				bunyan.error(err);
			}
		});

		bunyan.info('return success of all events sent to slack channel');

		return { totalSuccessfullySent, totalEvents: events.length };
		
	} catch (err) {

		bunyan.error(err);

		throw err;

	}

}
