import { TrackingEvent } from './tracking-event';
import { TRACKING_EVENT } from '../../../tests/tracking.fixtures.spec';
import { replace } from '@features/upload/components/drop-area/node_modules/lodash-es';

describe('TrackingEvent', () => {
  const platform = 'MacOS';
  const os = '5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36';
  const screenWidth = '1366';
  const screenHeight = '768';
  const type = 'Computer';
  const deviceAccessTokenId = 'a-b-c';
  const manufacturer = 'Chrome';
  const model = '64';

  it('should create an instance', () => {
    expect(TRACKING_EVENT).toBeTruthy();
    expect(TRACKING_EVENT instanceof TrackingEvent).toBeTruthy();
  });
  describe('setDeviceInfo', () => {
    it('should set the deviceInfo with the given parameters', () => {
      TRACKING_EVENT.setDeviceInfo(
        os,
        platform,
        deviceAccessTokenId,
        manufacturer,
        model
      );
      expect(TRACKING_EVENT.sessions[0].device).toEqual({
        type: type,
        manufacturer: manufacturer,
        model: model,
        platform: platform,
        os: os,
        screenwidth: screenWidth,
        screenheight: screenHeight,
        locale: replace(navigator.language, '-', '_'),
        deviceAccessTokenId: deviceAccessTokenId,
      });
    });
  });
  describe('setAttributes', () => {
    it('should set the attributes of the event to the given ones', () => {
      const attributes = { product_id: 5 };

      TRACKING_EVENT.setAttributes(attributes);

      expect(TRACKING_EVENT.sessions[0].events[0].attributes).toEqual(
        attributes
      );
    });
  });
  describe('setSessionId', () => {
    it('should set the session id to equal the cookie if it exists', () => {
      const sessionId = 'a-b-c';

      TRACKING_EVENT.setSessionId(sessionId);

      expect(TRACKING_EVENT.sessions[0]['id']).toEqual(sessionId);
    });
  });
});
