import sendSlackMessage from '../services/sendSlackMessage';
import sendToElasticSearch from '../services/sendToElasticSearch';

async function processSingleEvent(config, state, event) {
	await sendSlackMessage(config, state, event);
	await sendToElasticSearch(config, state, event);
}

export default async function (config, state, cmdParams) {	
	const { REEF_CHECKPOINT } = config;
	const { bunyan } = state;
	const { events } = cmdParams;

	bunyan.info('processing [DIGEST_EVENTS] command', cmdParams);

	try {
		bunyan.info('mapping events to slack messages');

		let promises = events.map(event => processSingleEvent(config, state, event));

		await Promise.all(promises);
		
		bunyan.info('return success of all events sent to slack channel');
		
		return { success: true };
	} catch (err) {
		bunyan.error(err);
		throw err;
	}
}
