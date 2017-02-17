import bunyan from 'bunyan';

export default function (config) {
	return bunyan.createLogger({
		name: config.name,
		level: config.level || 'info',
		stream: config.stream,
		serializers : bunyan.stdSerializers
	});
}
