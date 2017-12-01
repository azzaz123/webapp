import { TrackingEvent } from './tracking-event';
import { TRACKING_EVENT } from '../../../tests/tracking.fixtures';

describe('TrackingEvent', () => {
  const platform: string = 'MacOS';
  const os: string = '5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36';
  const screenWidth: string = '1366';
  const screenHeight: string = '768';
  const type: string = 'PC';

  it('should create an instance', () => {
    expect(TRACKING_EVENT).toBeTruthy();
    expect(TRACKING_EVENT instanceof TrackingEvent).toBeTruthy();
  });
  describe('setDeviceInfo', () => {
    it('should set the deviceInfo with the given parameters', () => {
      TRACKING_EVENT.setDeviceInfo(os, platform);
      expect(TRACKING_EVENT['sessions'][0]['device']).toEqual({
        platform: platform,
        screenwidth: screenWidth,
        screenheight: screenHeight,
        locale: navigator.language,
        type: type,
        os: os
      });
    });
  });
  describe('setAttributes', () => {
    it('should set the attributes of the event to the given ones', () => {
      TRACKING_EVENT.setAttributes({product_id: 5});
      expect(TRACKING_EVENT['sessions'][0]['events'][0]['attributes']).toEqual({product_id: 5});
    });
  });
  describe('setEntryPoint', () => {
    it('should set the entryPoint using the number from the constant', () => {
      expect(TRACKING_EVENT['sessions'][0].entryPoint).toBe('89')
    });
  });
});
