
export default async function (config, state, dashlets) {
		
	let { bunyan, reefClient } = state,
		{ KUMELI_DIRECTOR } = config;

	try {

		dashlets.forEach(dashlet => {

			bunyan.info('updating dashlet', dashlet.dashletUid);

			reefClient.execute(KUMELI_DIRECTOR, 'shared', 'UPDATE_DASHLET', dashlet).then(response => {

				bunyan.info('dashlet updated', dashlet.dashletUid, response);

			}, err => {

				bunyan.error('dashlet update error', dashlet.dashletUid, err);

			});

		});

		return { success: true };
		
	} catch (err) {

		bunyan.error(err);
		throw err;

	}

}
