import request from 'request';
import messageIcon from '../conventions/messageIcon';

export default function (event, config, state) {
    
    let { stream, type, ocurredTs, data } = event,
        { SLACK_TOKEN, SLACK_CHANNEL } = config,
        { bunyan } = state,
        fields = [];
    
    bunyan.info('sending event to slack channel', event.stream, event.type);
    
    if(data) {
        fields = Object.keys(data).map(key => {
            return {
                "title": key,
                "value": data[key],
                "short": false
            }
        });
    };

    return new Promise ((resolve, reject) => {
        request.post({
            json: true,
            url: 'https://slack.com/api/chat.postMessage',
            qs: {
                "token": SLACK_TOKEN,
                "channel": SLACK_CHANNEL,
                "text": event.stream,
                "icon_url": messageIcon(stream),
                "attachments": JSON.stringify([
                    {
                        "title": event.type,
                        "text": new Date(event.ocurredTs),
                        "fields": fields,
                        "color": (stream.includes("error")) ? '#ff0000' : null,
                    }
                ]),
            },
        },
        (err, resp, body) => {
            if (body.ok) 
                resolve();
            
            reject(body.error);
        });
    });
}