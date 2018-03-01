import { TrackingEvent } from './tracking-event';
import { TRACKING_EVENT } from '../../../tests/tracking.fixtures';
import * as _ from 'lodash';

describe('TrackingEvent', () => {
  const platform: string = 'MacOS';
  const os: string = '5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36';
  const screenWidth: string = '1366';
  const screenHeight: string = '768';
  const type: string = 'Computer';
  const deviceAccessTokenId: string = 'a-b-c';
  const manufacturer: string = 'Chrome';
  const model: string = '64';

  it('should create an instance', () => {
    expect(TRACKING_EVENT).toBeTruthy();
    expect(TRACKING_EVENT instanceof TrackingEvent).toBeTruthy();
  });
  describe('setDeviceInfo', () => {
    it('should set the deviceInfo with the given parameters', () => {
      TRACKING_EVENT.setDeviceInfo(os, platform, deviceAccessTokenId, manufacturer, model);
      expect(TRACKING_EVENT['sessions'][0]['device']).toEqual({
        type: type,
        manufacturer: manufacturer,
        model: model,
        platform: platform,
        os: os,
        screenwidth: screenWidth,
        screenheight: screenHeight,
        locale: _.replace(navigator.language,"-", "_"),
        deviceAccessTokenId: deviceAccessTokenId
      });
    });
  });
  describe('setAttributes', () => {
    it('should set the attributes of the event to the given ones', () => {
      const attributes = {product_id: 5};

      TRACKING_EVENT.setAttributes(attributes);

      expect(TRACKING_EVENT['sessions'][0]['events'][0]['attributes']).toEqual(attributes);
    });
  });
  describe('setSessionId', () => {
    it('should set the session id to equal the cookie if it exists', () => {
      const sessionId = 'a-b-c';

      TRACKING_EVENT.setSessionId(sessionId);

      expect(TRACKING_EVENT['sessions'][0]['id']).toEqual(sessionId);
    });
  });
});
