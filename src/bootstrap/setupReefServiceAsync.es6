import { SqsBrokerFacade, ReefService } from 'reef-service';

export default async function (config, bunyan) {

	let brokerFacade = new SqsBrokerFacade(config),
		service = new ReefService(brokerFacade);

	bunyan.info('setting up reef service', config);

	await service.setup();

	return service;

}
