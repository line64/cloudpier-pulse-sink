import { SqsBrokerFacade, ReefClient } from 'reef-client';

export default async function (config, bunyan) {

	let brokerFacade = new SqsBrokerFacade(config),
		client = new ReefClient(brokerFacade);

	bunyan.info('setting up reef client');

	await client.setup();

	return client;
	
}
