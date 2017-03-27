import setupBunyanLog from './setupBunyanLog';
import setupReefServiceAsync from './setupReefServiceAsync';
import setupReefClientAsync from './setupReefClientAsync';

export async function setupStateAsync(config) {

	let bunyan = setupBunyanLog({
		level: config.LOG_LEVEL || 'info',
		stream: config.LOG_STREAM,
		name: config.DOMAIN
	});

	let reefService = await setupReefServiceAsync({
		region: config.AWS_REGION,
		accessKeyId: config.AWS_ACCESSKEYID,
		secretAccessKey: config.AWS_SECRETACCESSKEY,
		serviceDomain: config.REEF_PULSE_DOMAIN,
		serviceLane: config.REEF_PULSE_LANE
	}, bunyan);

	return { bunyan, reefService };

}
