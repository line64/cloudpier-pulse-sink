import fetch from 'node-fetch';

export default async function (config, state, event) {
    const { ELASTICSEARCH_ENDPOINT } = config;
    const { bunyan } = state;
    const { stream, type, ocurredTs, data } = event;
    
    bunyan.info('sending event to elasticsearch', { stream, type, ocurredTs });
    
    try {
        const res = await fetch(`${ELASTICSEARCH_ENDPOINT}/${stream}/${type}/`, {
            method: 'POST',
            body: JSON.stringify({ ocurredTs, data }),
        });

        if (res.ok) {
            throw new Error('Unable to post event to elastic search');
        }
    } catch (err) {
        throw new Error('Unable to post event to elastic search');
    }
}