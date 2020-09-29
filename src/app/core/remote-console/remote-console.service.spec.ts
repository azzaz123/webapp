import { fakeAsync, TestBed } from '@angular/core/testing';
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
import { RemoteConsoleClientServiceMock } from '../../../tests/remote-console-service-client.fixtures.spec';
import { of } from 'rxjs';
import { ConnectionType } from './connection-type';

describe('RemoteConsoleService', () => {

  const DEVICE_ID = 'DEVICE_ID';

  let httpTestingController: HttpTestingController;
  let service: RemoteConsoleService;
  let remoteConsoleClientService: RemoteConsoleClientService;
  let userService: UserService;
  let commonLog = {};

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

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RemoteConsoleService);
    remoteConsoleClientService = TestBed.inject(RemoteConsoleClientService);
    userService = TestBed.inject(UserService);

    service.deviceId = DEVICE_ID;
  });

  beforeEach(() => {
    commonLog = {
      'timestamp': 4000,
      'client': 'WEB',
      'device_id': DEVICE_ID,
      'browser': BROWSER,
      'browser_version': BROWSER_VERSION,
      'user_id': USER_ID,
      'feature_flag': true,
      'app_version': service.getReleaseVersion(APP_VERSION),
      'ping_time_ms': navigator['connection']['rtt'],
      'connection_type': '',
      'session_id': undefined,
    };
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
        'app_version': service.getReleaseVersion(APP_VERSION),
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
        'app_version': service.getReleaseVersion(APP_VERSION),
        'metric_type': MetricTypeEnum.XMPP_CONNECTION_TIME,
        'message': 'xmpp connection time',
        'connection_time': CONNECTION_TIME,
        'call_no': 3,
        'connection_type': '',
        'ping_time_ms': navigator['connection']['rtt']
      });
    });
  });

  describe('sendChatConnectionTime', () => {
    const SESSION_ID = 'session-id';

    const commonConnectionChatTimeoutLog = {
      'metric_type': MetricTypeEnum.CHAT_CONNECTION_TIME,
      'session_id': SESSION_ID,
      'connection_type': '',
      'ping_time_ms': navigator['connection']['rtt'],
    };

    beforeEach(() => {
      spyOn(userService, 'me').and.returnValue(of({ id: USER_ID }));
      spyOn(remoteConsoleClientService, 'info');
      service.sessionId = SESSION_ID;
    });

    it('should connect to chat', () => {
      spyOn(Date, 'now').and.returnValues(3000, 4000, 4500);

      service.sendChatConnectionTime(ConnectionType.INBOX, true);
      service.sendChatConnectionTime(ConnectionType.XMPP, true);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        ...commonConnectionChatTimeoutLog,
        'connection_time': 1500,
        'xmpp_retry_count': 1,
        'inbox_retry_count': 1,
      });
    });

    it('should not connect to chat', () => {
      service.sendChatConnectionTime(ConnectionType.INBOX, false);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should not connect to chat if has get response from inbox but can not connect to xmpp', () => {
      service.sendChatConnectionTime(ConnectionType.INBOX, false);
      service.sendChatConnectionTime(ConnectionType.INBOX, true);
      service.sendChatConnectionTime(ConnectionType.XMPP, false);
      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should connect to chat if was 1 error when get inbox', () => {
      spyOn(Date, 'now').and.returnValues(3000, 4000, 4700);

      service.sendChatConnectionTime(ConnectionType.INBOX, false);
      service.sendChatConnectionTime(ConnectionType.INBOX, true);
      service.sendChatConnectionTime(ConnectionType.XMPP, true);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        ...commonConnectionChatTimeoutLog,
        'connection_time': 1700,
        'inbox_retry_count': 2,
        'xmpp_retry_count': 1,
      });
    });

    it('should connect to chat if were 2 error when get inbox', () => {
      spyOn(Date, 'now').and.returnValues(3000, 4000, 4800);

      service.sendChatConnectionTime(ConnectionType.INBOX, false);
      service.sendChatConnectionTime(ConnectionType.INBOX, false);
      service.sendChatConnectionTime(ConnectionType.INBOX, true);
      service.sendChatConnectionTime(ConnectionType.XMPP, true);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        ...commonConnectionChatTimeoutLog,
        'connection_time': 1800,
        'inbox_retry_count': 3,
        'xmpp_retry_count': 1,
      });
    });

    it('should connect to chat if was 2 error when get inbox and 1 error when connect to xmpp', () => {
      spyOn(Date, 'now').and.returnValues(3000, 4000, 4900);

      service.sendChatConnectionTime(ConnectionType.INBOX, false);
      service.sendChatConnectionTime(ConnectionType.INBOX, false);
      service.sendChatConnectionTime(ConnectionType.INBOX, true);
      service.sendChatConnectionTime(ConnectionType.XMPP, false);
      service.sendChatConnectionTime(ConnectionType.XMPP, true);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        ...commonConnectionChatTimeoutLog,
        'connection_time': 1900,
        'inbox_retry_count': 3,
        'xmpp_retry_count': 2,
      });
    });

    it('should connect to chat 2 times', () => {
      spyOn(Date, 'now').and.returnValues(3000, 4000, 5100, 6000, 4000, 6200);

      service.sendChatConnectionTime(ConnectionType.INBOX, false);
      service.sendChatConnectionTime(ConnectionType.INBOX, true);
      service.sendChatConnectionTime(ConnectionType.XMPP, false);
      service.sendChatConnectionTime(ConnectionType.XMPP, true);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        ...commonConnectionChatTimeoutLog,
        'connection_time': 2100,
        'inbox_retry_count': 2,
        'xmpp_retry_count': 2,
      });

      service.sendChatConnectionTime(ConnectionType.INBOX, true);
      service.sendChatConnectionTime(ConnectionType.XMPP, false);
      service.sendChatConnectionTime(ConnectionType.XMPP, true);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        ...commonConnectionChatTimeoutLog,
        'connection_time': 200,
        'inbox_retry_count': 1,
        'xmpp_retry_count': 2,
      });
    });
  });

  describe('sendMessageAckFailed', () => {

    it('should send metric if send message is failed', () => {
      const MESSAGE_ID = 'MESSAGE_ID';
      const DESCRIPTION = 'MESSAGE_ID';
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(4000);

      service.sendMessageAckFailed(MESSAGE_ID, DESCRIPTION);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': MESSAGE_ID,
        'metric_type': MetricTypeEnum.MESSAGE_SENT_ACK_FAILED,
        'description': DESCRIPTION
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

      service.sendDuplicateConversations(USER_ID, LOAD_MORE_CONVERSATIONS, CONVERSATIONS_BY_ID);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'metric_type': MetricTypeEnum.DUPLICATE_CONVERSATION,
        'message': 'send log when user see duplicate conversation in inbox',
        'call_method_client': LOAD_MORE_CONVERSATIONS,
        'conversations_count_by_id': JSON.stringify({ 'xa4ld642': 2 })
      });
    });
  });

  describe('sendConnectionChatFailed', () => {

    it('should call connection failed if inbox return error', () => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(4000);

      service.sendConnectionChatFailed(ConnectionType.INBOX);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'metric_type': MetricTypeEnum.CHAT_FAILED_CONNECTION,
        'description': 'Get inbox is failed',
        'xmpp_connected': false
      });
    });

    it('should call connection failed if inbox return error', () => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(4000);

      service.sendConnectionChatFailed(ConnectionType.XMPP);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'metric_type': MetricTypeEnum.CHAT_FAILED_CONNECTION,
        'description': 'Connection xmpp is failed',
        'xmpp_connected': true
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

  describe('sendMessageActTimeout', () => {
    it('should NOT send call', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendMessageActTimeout(null);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init timestamp', () => {
      spyOn(remoteConsoleClientService, 'info');

      service.sendMessageActTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).not.toHaveBeenCalledWith();
    });

    it('should send call with act sending time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 4000, 2000);

      service.sendMessageActTimeout('MESSAGE_ID');
      service.sendMessageActTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'message_id': 'MESSAGE_ID',
        'send_message_time': 1000,
        'metric_type': MetricTypeEnum.MESSAGE_SENT_ACK_TIME
      });
    }));

    it('should send twice time call with act sending time', fakeAsync(() => {
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000, 4000, 4000);

      service.sendMessageActTimeout('MESSAGE_ID_1');
      service.sendMessageActTimeout('MESSAGE_ID_2');
      service.sendMessageActTimeout('MESSAGE_ID_1');

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'send_message_time': 3000,
        'metric_type': MetricTypeEnum.MESSAGE_SENT_ACK_TIME,
        'message_id': 'MESSAGE_ID_1'
      });

      service.sendMessageActTimeout('MESSAGE_ID_2');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(2);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'send_message_time': 2000,
        'metric_type': MetricTypeEnum.MESSAGE_SENT_ACK_TIME,
        'message_id': 'MESSAGE_ID_2'
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

  describe('sendXmppConnectionClosedWithError', () => {

    it('should send call with presentation message time', fakeAsync(() => {
      spyOn(userService, 'me').and.returnValue(of({ id: USER_ID }));
      spyOn(remoteConsoleClientService, 'info');
      spyOn(Date, 'now').and.returnValues(4000, 1000);

      service.sendXmppConnectionClosedWithError();

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        'metric_type': MetricTypeEnum.XMPP_CONNECTION_CLOSED_WITH_ERROR,
        'message': '',
      });
    }));
  });

  describe('getReleaseVersion', () => {

    it('should return release version', fakeAsync(() => {
      expect(service.getReleaseVersion('1')).toEqual(1);
      expect(service.getReleaseVersion('1.9')).toEqual(1009);
      expect(service.getReleaseVersion('1.2.5')).toEqual(1002005);
      expect(service.getReleaseVersion('1.20.5')).toEqual(1020005);
      expect(service.getReleaseVersion('1.320.512')).toEqual(1320512);
      expect(service.getReleaseVersion('23.320.512')).toEqual(23320512);
      expect(service.getReleaseVersion('157.320.512')).toEqual(157320512);
    }));
  });
});
