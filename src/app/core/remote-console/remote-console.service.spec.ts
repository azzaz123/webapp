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
import { of } from 'rxjs';
import { ConnectionType } from './connection-type';
import { CookieService } from 'ngx-cookie';
import { UuidService } from '../uuid/uuid.service';

describe('RemoteConsoleService', () => {
  const DEVICE_ID = 'DEVICE_ID';
  const SESSION_ID = 'SESSION_ID';

  let httpTestingController: HttpTestingController;
  let service: RemoteConsoleService;
  let remoteConsoleClientService: RemoteConsoleClientService;
  let userService: UserService;
  let cookieService: CookieService;
  let commonLog = {};
  let uuidService: UuidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RemoteConsoleService,
        RemoteConsoleClientService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
        { provide: UserService, useClass: MockedUserService },
        {
          provide: CookieService,
          useValue: {
            get: (_name) => DEVICE_ID,
          },
        },
      ],
    });
    uuidService = TestBed.inject(UuidService);
    spyOn(uuidService, 'getUUID').and.returnValue(SESSION_ID);
  });

  beforeEach(() => {
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RemoteConsoleService);
    remoteConsoleClientService = TestBed.inject(RemoteConsoleClientService);
    userService = TestBed.inject(UserService);
    cookieService = TestBed.inject(CookieService);

    spyOn(remoteConsoleClientService, 'info');
    spyOn(remoteConsoleClientService, 'info$').and.returnValue(of({}));

    commonLog = {
      timestamp: 4000,
      client: 'WEB',
      device_id: DEVICE_ID,
      browser: BROWSER,
      browser_version: BROWSER_VERSION,
      user_id: USER_ID,
      feature_flag: true,
      app_version: service.getReleaseVersion(APP_VERSION),
      ping_time_ms: navigator['connection']['rtt'],
      connection_type: '',
      session_id: SESSION_ID,
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
      spyOn(Date, 'now').and.returnValues(4000);

      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        timestamp: 4000,
        client: 'WEB',
        device_id: DEVICE_ID,
        browser: BROWSER,
        browser_version: BROWSER_VERSION,
        user_id: LOCAL_USER_ID,
        feature_flag: true,
        app_version: service.getReleaseVersion(APP_VERSION),
        metric_type: MetricTypeEnum.XMPP_CONNECTION_TIME,
        message: 'xmpp connection time',
        connection_time: CONNECTION_TIME,
        call_no: 1,
        connection_type: '',
        ping_time_ms: navigator['connection']['rtt'],
        session_id: SESSION_ID,
      });
    });

    it('should call xmpp conection with parameters and increase number of call if service call method multiple times', () => {
      const LOCAL_USER_ID = 'USER_ID';
      const CONNECTION_TIME = 1000;
      spyOn(Date, 'now').and.returnValues(4000, 4000, 4000);

      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);
      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);
      service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        timestamp: 4000,
        client: 'WEB',
        device_id: DEVICE_ID,
        browser: BROWSER,
        browser_version: BROWSER_VERSION,
        user_id: LOCAL_USER_ID,
        feature_flag: true,
        app_version: service.getReleaseVersion(APP_VERSION),
        metric_type: MetricTypeEnum.XMPP_CONNECTION_TIME,
        message: 'xmpp connection time',
        connection_time: CONNECTION_TIME,
        call_no: 3,
        connection_type: '',
        ping_time_ms: navigator['connection']['rtt'],
        session_id: SESSION_ID,
      });
    });
  });

  describe('sendChatConnectionTime - [CHAT_CONNECTION_TIME]', () => {
    const commonConnectionChatTimeoutLog = {
      metric_type: MetricTypeEnum.CHAT_CONNECTION_TIME,
      session_id: SESSION_ID,
      connection_type: '',
      ping_time_ms: navigator['connection']['rtt'],
    };

    describe('when the webapp has connected properly to the chat', () => {
      beforeEach(() => {
        spyOn(Date, 'now').and.returnValues(3000, 4000, 4500);

        service.sendChatConnectionTime(ConnectionType.XMPP, true);
        service.sendChatConnectionTime(ConnectionType.INBOX, true);
      });

      it('should track the metric', () => {
        expect(remoteConsoleClientService.info$).toHaveBeenCalledWith({
          ...commonLog,
          ...commonConnectionChatTimeoutLog,
          connection_time: 1500,
          xmpp_retry_count: 1,
          inbox_retry_count: 1,
        });
      });

      describe('and when the webapp connects again to the chat', () => {
        beforeEach(() => {
          service.sendChatConnectionTime(ConnectionType.XMPP, true);
          service.sendChatConnectionTime(ConnectionType.INBOX, true);
        });

        it('should not track more times the metric', () => {
          expect(remoteConsoleClientService.info$).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('when the webapp could not connect to the real time chat', () => {
      beforeEach(() => service.sendChatConnectionTime(ConnectionType.XMPP, false));

      it('should not track the metric', () => {
        expect(remoteConsoleClientService.info$).not.toHaveBeenCalled();
      });
    });

    describe('when the webapp can not get the inbox', () => {
      beforeEach(() => {
        service.sendChatConnectionTime(ConnectionType.XMPP, true);
        service.sendChatConnectionTime(ConnectionType.INBOX, false);
      });

      it('should not track the metric', () => {
        expect(remoteConsoleClientService.info$).not.toHaveBeenCalled();
      });
    });

    describe('when the server fails two times and then works connecting to the real time chat', () => {
      beforeEach(() => {
        spyOn(Date, 'now').and.returnValues(3000, 4000, 4800);
        service.sendChatConnectionTime(ConnectionType.XMPP, false);
        service.sendChatConnectionTime(ConnectionType.XMPP, false);
        service.sendChatConnectionTime(ConnectionType.XMPP, true);
      });

      describe('and when the server fails two times and then works getting the inbox', () => {
        beforeEach(() => {
          service.sendChatConnectionTime(ConnectionType.INBOX, false);
          service.sendChatConnectionTime(ConnectionType.INBOX, false);
          service.sendChatConnectionTime(ConnectionType.INBOX, true);
        });

        it('should track the metric with 4 retries each', () => {
          expect(remoteConsoleClientService.info$).toHaveBeenCalledWith({
            ...commonLog,
            ...commonConnectionChatTimeoutLog,
            connection_time: 1800,
            inbox_retry_count: 3,
            xmpp_retry_count: 3,
          });
        });
      });
    });
  });

  describe('sendMessageAckFailed', () => {
    it('should send metric if send message is failed', () => {
      const MESSAGE_ID = 'MESSAGE_ID';
      const DESCRIPTION = 'MESSAGE_ID';
      spyOn(Date, 'now').and.returnValues(4000);

      service.sendMessageAckFailed(MESSAGE_ID, DESCRIPTION);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        message_id: MESSAGE_ID,
        metric_type: MetricTypeEnum.MESSAGE_SENT_ACK_FAILED,
        description: DESCRIPTION,
      });
    });
  });

  describe('sendDuplicateConversations', () => {
    it('should call duplicated conversation conection with parameters', () => {
      const CONVERSATIONS_BY_ID = new Map();
      const LOAD_MORE_CONVERSATIONS = 'LOAD_INBOX';
      CONVERSATIONS_BY_ID['xa4ld642'] = 2;

      spyOn(Date, 'now').and.returnValues(4000);

      service.sendDuplicateConversations(USER_ID, LOAD_MORE_CONVERSATIONS, CONVERSATIONS_BY_ID);

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        metric_type: MetricTypeEnum.DUPLICATE_CONVERSATION,
        message: 'send log when user see duplicate conversation in inbox',
        call_method_client: LOAD_MORE_CONVERSATIONS,
        conversations_count_by_id: JSON.stringify({ xa4ld642: 2 }),
      });
    });
  });

  describe('sendConnectionChatFailed - [CHAT_FAILED_CONNECTION]', () => {
    describe('when the webapp has connected to the real time chat', () => {
      beforeEach(() => {
        spyOn(Date, 'now').and.returnValues(4000, 4000);
        service.sendChatConnectionTime(ConnectionType.XMPP, true);
      });

      it('should track the metric notifying real time chat was connected', () => {
        service.sendChatFailedConnection();

        expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
          ...commonLog,
          metric_type: MetricTypeEnum.CHAT_FAILED_CONNECTION,
          xmpp_connected: true,
        });
      });
    });

    describe('when the webapp could not connect to the real time chat', () => {
      beforeEach(() => {
        spyOn(Date, 'now').and.returnValues(4000, 4000);
        service.sendChatConnectionTime(ConnectionType.XMPP, false);
      });

      it('should track the metric notifying real time chat was not connected', () => {
        service.sendChatFailedConnection();

        expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
          ...commonLog,
          metric_type: MetricTypeEnum.CHAT_FAILED_CONNECTION,
          xmpp_connected: false,
        });
      });
    });
  });

  describe('sendMessageTimeout', () => {
    it('should NOT send call', () => {
      service.sendMessageTimeout(null);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init timestamp', () => {
      service.sendMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).not.toHaveBeenCalledWith();
    });

    it('should send call with sending time', fakeAsync(() => {
      spyOn(Date, 'now').and.returnValues(1000, 4000, 2000);

      service.sendMessageTimeout('MESSAGE_ID');
      service.sendMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        message_id: 'MESSAGE_ID',
        send_message_time: 1000,
        metric_type: MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME,
      });
    }));

    it('should send twice time call with sending time', fakeAsync(() => {
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000, 4000, 4000);

      service.sendMessageTimeout('MESSAGE_ID_1');
      service.sendMessageTimeout('MESSAGE_ID_2');
      service.sendMessageTimeout('MESSAGE_ID_1');

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        send_message_time: 3000,
        metric_type: MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME,
        message_id: 'MESSAGE_ID_1',
      });

      service.sendMessageTimeout('MESSAGE_ID_2');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(2);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        send_message_time: 2000,
        metric_type: MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME,
        message_id: 'MESSAGE_ID_2',
      });
    }));
  });

  describe('sendMessageActTimeout', () => {
    it('should NOT send call', () => {
      service.sendMessageActTimeout(null);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init timestamp', () => {
      service.sendMessageActTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).not.toHaveBeenCalledWith();
    });

    it('should send call with act sending time', fakeAsync(() => {
      spyOn(Date, 'now').and.returnValues(1000, 4000, 2000);

      service.sendMessageActTimeout('MESSAGE_ID');
      service.sendMessageActTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        message_id: 'MESSAGE_ID',
        send_message_time: 1000,
        metric_type: MetricTypeEnum.MESSAGE_SENT_ACK_TIME,
      });
    }));

    it('should send twice time call with act sending time', fakeAsync(() => {
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000, 4000, 4000);

      service.sendMessageActTimeout('MESSAGE_ID_1');
      service.sendMessageActTimeout('MESSAGE_ID_2');
      service.sendMessageActTimeout('MESSAGE_ID_1');

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        send_message_time: 3000,
        metric_type: MetricTypeEnum.MESSAGE_SENT_ACK_TIME,
        message_id: 'MESSAGE_ID_1',
      });

      service.sendMessageActTimeout('MESSAGE_ID_2');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(2);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        send_message_time: 2000,
        metric_type: MetricTypeEnum.MESSAGE_SENT_ACK_TIME,
        message_id: 'MESSAGE_ID_2',
      });
    }));
  });

  describe('sendPresentationMessageTimeout', () => {
    it('should NOT send call', () => {
      service.sendPresentationMessageTimeout(null);

      expect(remoteConsoleClientService.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init calculate time', () => {
      service.sendPresentationMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).not.toHaveBeenCalledWith();
    });

    it('should send call with presentation message time', fakeAsync(() => {
      spyOn(Date, 'now').and.returnValues(1000, 4000, 2000);

      service.sendPresentationMessageTimeout('MESSAGE_ID');
      service.sendPresentationMessageTimeout('MESSAGE_ID');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        message_id: 'MESSAGE_ID',
        send_message_time: 1000,
        metric_type: MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
        ping_time_ms: navigator['connection']['rtt'],
      });
    }));

    it('should send twice time call with presentation message time', fakeAsync(() => {
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000, 4000, 4000);

      service.sendPresentationMessageTimeout('MESSAGE_ID_1');
      service.sendPresentationMessageTimeout('MESSAGE_ID_2');
      service.sendPresentationMessageTimeout('MESSAGE_ID_1');

      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        message_id: 'MESSAGE_ID_1',
        send_message_time: 3000,
        metric_type: MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
        ping_time_ms: navigator['connection']['rtt'],
      });

      service.sendPresentationMessageTimeout('MESSAGE_ID_2');

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(2);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        message_id: 'MESSAGE_ID_2',
        send_message_time: 2000,
        metric_type: MetricTypeEnum.CLIENT_PRESENTATION_MESSAGE_TIME,
        ping_time_ms: navigator['connection']['rtt'],
      });
    }));
  });

  describe('sendXmppConnectionClosedWithError', () => {
    it('should send call with presentation message time', fakeAsync(() => {
      spyOn(Date, 'now').and.returnValues(4000, 1000);

      service.sendXmppConnectionClosedWithError();

      expect(remoteConsoleClientService.info).toHaveBeenCalledTimes(1);
      expect(remoteConsoleClientService.info).toHaveBeenCalledWith({
        ...commonLog,
        metric_type: MetricTypeEnum.XMPP_CONNECTION_CLOSED_WITH_ERROR,
        message: '',
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
