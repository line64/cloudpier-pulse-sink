import axios from 'axios'

function sendMessage(text, config, index) {
    
    let { SLACK_TOKEN, SLACK_CHANNEL } = config;

    return axios.post(`https://slack.com/api/chat.postMessage?token=${ SLACK_TOKEN }&pretty=1&channel=${ SLACK_CHANNEL }&text=${JSON.stringify(text)}`);
}


export default sendMessage