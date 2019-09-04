import { environment } from '../../environments/environment';
import remote from 'loglevel-plugin-remote';
import logger from 'loglevel';

const options = {
  url: environment.remoteConsoleUrl,
  method: 'POST',
  timestamp: () => new Date().getTime(),
  format: plain,
  interval: 1,
  capacity: 1,
};

function plain(log) {
  const message = JSON.parse(log.message);
  return { timestamp: log.timestamp, client: 'WEB', ...message };
}

export function configRemoteConsole() {
  if (remote) {
    logger.enableAll();
    remote.apply(logger, options);
  }
}
