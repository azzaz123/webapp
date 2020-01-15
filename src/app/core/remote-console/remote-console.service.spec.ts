import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RemoteConsoleService } from './remote-console.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BROWSER, BROWSER_VERSION, DeviceDetectorServiceMock, FeatureFlagServiceMock } from '../../../tests';
import { FeatureflagService } from '../user/featureflag.service';
import { MetricTypeEnum } from './metric-type.enum';
import { APP_VERSION } from '../../../environments/version';
import { UserService } from '../user/user.service';
import { MockedUserService, USER_ID } from '../../../tests/user.fixtures.spec';
import { RemoteConsoleClientService } from './remote-console-client.service';
import { RemoteConsoleClientServiceMock } from '../../../tests/remote-console-service-client.spec';

describe('RemoteConsoleService', () => {

  const DEVICE_ID = 'DEVICE_ID';

  let httpTestingController: HttpTestingController;
  let service: RemoteConsoleService;
  let remoteConsoleClientService: RemoteConsoleClientService;

  const commonLog = {
    'timestamp': 4000,
    'client': 'WEB',
    'device_id': DEVICE_ID,
    'browser': BROWSER,
    'browser_version': BROWSER_VERSION,
    'user_id': USER_ID,
    'feature_flag': true,
    'app_version': APP_VERSION,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        RemoteConsoleService,
        { provide: RemoteConsoleClientService, useClass: RemoteConsoleClientServiceMock },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
        { provide: UserService, useClass: MockedUserService }
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(RemoteConsoleService);
    remoteConsoleClientService = TestBed.get(RemoteConsoleClientService);

    service.deviceId = DEVICE_ID;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendConnectionTimeout', () => {
    it('should call xmpp conection with parameters', () => {
      const LOCAL_USER_ID = 'USER_ID';
      const CONNECTION_TIME = 1000;
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(4000);

      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        'timestamp': 4000,
        'client': 'WEB',
        'device_id': DEVICE_ID,
        'browser': BROWSER,
        'browser_version': BROWSER_VERSION,
        'user_id': LOCAL_USER_ID,
        'feature_flag': true,
        'app_version': APP_VERSION,
        'metric_type': MetricTypeEnum.XMPP_CONNECTION_TIME,
        'message': 'xmpp connection time',
        'connection_time': CONNECTION_TIME,
        'call_no': 1,
        'connection_type': '',
        'ping_time_ms': navigator['connection']['rtt']
      });
    });

    it('should call xmpp conection with parameters and increase number of call if service call method multiple times', () => {
      const LOCAL_USER_ID = 'USER_ID';
      const CONNECTION_TIME = 1000;
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(4000, 4000, 4000);

      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);
      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);
      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        'timestamp': 4000,
        'client': 'WEB',
        'device_id': DEVICE_ID,
        'browser': BROWSER,
        'browser_version': BROWSER_VERSION,
        'user_id': LOCAL_USER_ID,
        'feature_flag': true,
        'app_version': APP_VERSION,
        'metric_type': MetricTypeEnum.XMPP_CONNECTION_TIME,
        'message': 'xmpp connection time',
        'connection_time': CONNECTION_TIME,
        'call_no': 3,
        'connection_type': '',
        'ping_time_ms': navigator['connection']['rtt']
      });
    });
  });

  describe('sendDuplicateConversations', () => {

    it('should call duplicated conversation conection with parameters', () => {
      const LOCAL_USER_ID = 'USER_ID';
      const CONVERSATIONS_BY_ID = new Map();
      const LOAD_MORE_CONVERSATIONS = 'LOAD_INBOX';
      CONVERSATIONS_BY_ID['xa4ld642'] = 2;

      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(4000);

      service.sendDuplicateConversations(LOCAL_USER_ID, LOAD_MORE_CONVERSATIONS, CONVERSATIONS_BY_ID);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        'timestamp': 4000,
        'client': 'WEB',
        'device_id': DEVICE_ID,
        'browser': BROWSER,
        'browser_version': BROWSER_VERSION,
        'user_id': LOCAL_USER_ID,
        'feature_flag': true,
        'app_version': APP_VERSION,
        'metric_type': MetricTypeEnum.DUPLICATE_CONVERSATION,
        'message': 'send log when user see duplicate conversation in inbox',
        'call_method_client': LOAD_MORE_CONVERSATIONS,
        'conversations_count_by_id': JSON.stringify({ 'xa4ld642': 2 })
      });
    });
  });

  describe('sendMessageTimeout', () => {
    it('should NOT send call', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendMessageTimeout(null);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init timestamp', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).not.toHaveBeenCalledWith();
    });

    it('should send call with sending time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 4000, 2000);

      service.sendMessageTimeout('MESSAGE_ID');
      service.sendMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID',
        'send_message_time': 1000,
        'metric_type': MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME
      });
    }));

    it('should send twice time call with sending time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000, 4000, 4000);

      service.sendMessageTimeout('MESSAGE_ID_1');
      service.sendMessageTimeout('MESSAGE_ID_2');
      service.sendMessageTimeout('MESSAGE_ID_1');

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'send_message_time': 3000,
        'metric_type': MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME,
        'message_id': 'MESSAGE_ID_1'
      });

      service.sendMessageTimeout('MESSAGE_ID_2');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(2);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'send_message_time': 2000,
        'metric_type': MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME,
        'message_id': 'MESSAGE_ID_2'
      });
    }));
  });

  describe('sendAcceptedTimeout', () => {
    it('should NOT send call', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendAcceptTimeout(null);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init calculate time', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendAcceptTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).not.toHaveBeenCalledWith();
    });

    it('should send call with sending time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 4000, 2000);

      service.sendAcceptTimeout('MESSAGE_ID');
      service.sendAcceptTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID',
        'send_message_time': 1000,
        'metric_type': MetricTypeEnum.XMPP_ACCEPT_MESSAGE_TIME,
        'ping_time_ms': navigator['connection']['rtt']
      });
    }));

    it('should send twice time call with sending acceptance time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000, 4000, 4000);

      service.sendAcceptTimeout('MESSAGE_ID_1');
      service.sendAcceptTimeout('MESSAGE_ID_2');
      service.sendAcceptTimeout('MESSAGE_ID_1');

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID_1',
        'send_message_time': 3000,
        'metric_type': MetricTypeEnum.XMPP_ACCEPT_MESSAGE_TIME,
        'ping_time_ms': navigator['connection']['rtt']
      });

      service.sendAcceptTimeout('MESSAGE_ID_2');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(2);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID_2',
        'send_message_time': 2000,
        'metric_type': MetricTypeEnum.XMPP_ACCEPT_MESSAGE_TIME,
        'ping_time_ms': navigator['connection']['rtt']
      });
    }));
  });

  describe('sendPresentationMessageTimeout', () => {
    it('should NOT send call', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendPresentationMessageTimeout(null);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init calculate time', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendPresentationMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).not.toHaveBeenCalledWith();
    });

    it('should send call with presentation message time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 4000, 2000);

      service.sendPresentationMessageTimeout('MESSAGE_ID');
      service.sendPresentationMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID',
        'send_message_time': 1000,
        'metric_type': MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
        'ping_time_ms': navigator['connection']['rtt']
      });
    }));

    it('should send twice time call with presentation message time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000, 4000, 4000);

      service.sendPresentationMessageTimeout('MESSAGE_ID_1');
      service.sendPresentationMessageTimeout('MESSAGE_ID_2');
      service.sendPresentationMessageTimeout('MESSAGE_ID_1');

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID_1',
        'send_message_time': 3000,
        'metric_type': MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
        'ping_time_ms': navigator['connection']['rtt']
      });

      service.sendPresentationMessageTimeout('MESSAGE_ID_2');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(2);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID_2',
        'send_message_time': 2000,
        'metric_type': MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
        'ping_time_ms': navigator['connection']['rtt']
      });
    }));
  });
});
