import fetch from 'node-fetch';

export default async function (config, state, event) {
    const { ELASTICSEARCH_ENDPOINT } = config;
    const { bunyan } = state;
    const { stream, type, ocurredTs, data } = event;
    
    bunyan.info('sending event to elasticsearch', { stream, type, ocurredTs });
    
    try {
        const url = `${ELASTICSEARCH_ENDPOINT}/${stream}/${type}/`;

        const body = JSON.stringify({
            timestamp: new Date(ocurredTs).toISOString(),
            ...data
        });

        bunyan.info('sending elastic search API call', { url, body });

        const res = await fetch(url, {
            method: 'POST',
            body,
        });

        if (!res.ok) {
            bunyan.error(res.json());
            throw new Error('Unable to post event to elastic search');
        }
    } catch (err) {
        bunyan.error(err, 'error while sending to ElasticSearch');
        throw err;
    }
}