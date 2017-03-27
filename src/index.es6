import dotenv from 'dotenv';

import { setupStateAsync } from './bootstrap';
import { startServiceAsync } from './runtime';

async function start() {

	dotenv.load({ silent: true });

	const config = {

		DOMAIN: process.env.DOMAIN,
		LOG_LEVEL: process.env.LOG_LEVEL || 'info',
		LOG_STREAM: process.stdout,

		AWS_REGION: process.env.AWS_REGION,
		AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID,
		AWS_SECRETACCESSKEY: process.env.AWS_SECRETACCESSKEY,

		REEF_PULSE_DOMAIN: process.env.REEF_PULSE_DOMAIN,
		REEF_PULSE_LANE: process.env.REEF_PULSE_LANE,

		REEF_CHECKPOINT: process.env.REEF_CHECKPOINT,
		KUMELI_DIRECTOR: process.env.KUMELI_DIRECTOR,

		SLACK_TOKEN: process.env.SLACK_TOKEN,
		SLACK_CHANNEL: process.env.SLACK_CHANNEL,

		ELASTICSEARCH_ENDPOINT: process.env.ELASTICSEARCH_ENDPOINT,
			
	};

	let state = await setupStateAsync(config);

	await startServiceAsync(config, state);

}


start().catch((err) => {
	console.error(err);
	console.error(err.stack);
	process.exit(1);
});
