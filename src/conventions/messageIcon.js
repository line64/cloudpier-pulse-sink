const ERROR_ICON = 'http://mysuccessemagazine.com/wp-content/plugins/indeed-smart-popup/assets/img/close_1.png';

export default function(stream) {
  return (stream.includes("error")) ? ERROR_ICON : null;   
}