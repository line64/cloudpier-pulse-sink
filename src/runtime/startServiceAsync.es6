import curry from 'curry';
import digestEventsRunner from './digestEventsRunner';

export default async function (config, state) {

	let { bunyan, reefClient, reefService } = state;

	bunyan.info('starting up reef client');

	await reefClient.start();

	bunyan.info('hooking reef runners');

	reefService.addRunner('DIGEST_EVENTS', curry(digestEventsRunner)(config, state));

	bunyan.info('starting up reef service');

	await reefService.start();

	bunyan.info('listening');

}
