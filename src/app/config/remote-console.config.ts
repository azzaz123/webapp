import { environment } from '../../environments/environment';
import remote from 'loglevel-plugin-remote';
import logger from 'loglevel';

const options = {
  url: environment.remoteConsoleUrl,
  method: 'POST',
  timestamp: () => new Date().getTime(),
  format: plain,
};

function plain(log) {
  const message = JSON.parse(log.message);
  return { timestamp: log.timestamp, client: 'web', ...message };
}

export function configRemoteConsole() {
  if (remote) {
    remote.apply(logger, options);
  }
}
