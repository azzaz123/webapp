export const INVALID_TOKEN_ERROR_NAME = 'GeolocationNotAvailable';

export class GeolocationNotAvailableError extends Error {
  constructor(message) {
    super(message);

    this.name = INVALID_TOKEN_ERROR_NAME;
  }
}
