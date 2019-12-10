import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RemoteConsoleService } from './remote-console.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BROWSER, BROWSER_VERSION, DeviceDetectorServiceMock, FeatureFlagServiceMock } from '../../../tests';
import * as logger from 'loglevel';
import { FeatureflagService } from '../user/featureflag.service';
import { MetricTypeEnum } from './metric-type.enum';
import { APP_VERSION } from '../../../environments/version';
import { UserService } from '../user/user.service';
import { MockedUserService, USER_ID } from '../../../tests/user.fixtures.spec';

describe('RemoteConsoleService', () => {

  let httpTestingController: HttpTestingController;
  let service: RemoteConsoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        RemoteConsoleService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock },
        { provide: UserService, useClass: MockedUserService }
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(RemoteConsoleService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call xmpp conection with parameters', () => {
    const LOCAL_USER_ID = 'USER_ID';
    const CONNECTION_TIME = 1000;
    spyOn(logger, 'info');

    service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);

    expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
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
    }));
  });

  it('should call xmpp conection with parameters and increase number of call if service call method multiple times', () => {
    const LOCAL_USER_ID = 'USER_ID';
    const CONNECTION_TIME = 1000;
    spyOn(logger, 'info');

    service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);
    service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);
    service.sendConnectionTimeout(LOCAL_USER_ID, CONNECTION_TIME);

    expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
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
    }));
  });

  it('should call duplicated conversation conection with parameters', () => {
    const LOCAL_USER_ID = 'USER_ID';
    const CONVERSATIONS_BY_ID = new Map();
    const LOAD_MORE_CONVERSATIONS = 'LOAD_INBOX';
    CONVERSATIONS_BY_ID['xa4ld642'] = 2;
    spyOn(logger, 'info');

    service.sendDuplicateConversations(LOCAL_USER_ID, LOAD_MORE_CONVERSATIONS, CONVERSATIONS_BY_ID);

    expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
      'browser': BROWSER,
      'browser_version': BROWSER_VERSION,
      'user_id': LOCAL_USER_ID,
      'feature_flag': true,
      'app_version': APP_VERSION,
      'metric_type': MetricTypeEnum.DUPLICATE_CONVERSATION,
      'message': 'send log when user see duplicate conversation in inbox',
      'call_method_client': LOAD_MORE_CONVERSATIONS,
      'conversations_count_by_id': JSON.stringify({ 'xa4ld642': 2 })
    }));
  });

  describe('sendMessageTimeout', () => {

    const commonLog = {
      'browser': BROWSER,
      'browser_version': BROWSER_VERSION,
      'user_id': USER_ID,
      'feature_flag': true,
      'app_version': APP_VERSION,
      'message_id': 'MESSAGE_ID'
    };

    it('should NOT send call', () => {
      spyOn(logger, 'info');

      service.sendMessageTimeout(null);

      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init timestamp', () => {
      spyOn(logger, 'info');

      service.sendMessageTimeout('MESSAGE_ID');

      expect(logger.info).not.toHaveBeenCalledWith();
    });

    it('should send call with sending time', fakeAsync(() => {
      spyOn(logger, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000, 2000);

      service.sendMessageTimeout(null);
      service.sendMessageTimeout('MESSAGE_ID');

      expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
        ...commonLog, ...{
          'send_message_time': 1000,
          'metric_type': MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME
        }
      }));
    }));

    it('should send call with sending time', fakeAsync(() => {
      spyOn(logger, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000);

      service.sendMessageTimeout(null);
      service.sendMessageTimeout(null);
      service.sendMessageTimeout('MESSAGE_ID');

      expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
        ...commonLog, ...{
          'send_message_time': 3000,
          'metric_type': MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME
        }
      }));

      service.sendMessageTimeout('MESSAGE_ID');

      expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
        ...commonLog, ...{
          'send_message_time': 2000,
          'metric_type': MetricTypeEnum.CLIENT_SEND_MESSAGE_TIME
        }
      }));
    }));
  });

  describe('sendAcceptedTimeout', () => {
    const commonLog = {
      'browser': BROWSER,
      'browser_version': BROWSER_VERSION,
      'user_id': USER_ID,
      'feature_flag': true,
      'app_version': APP_VERSION,
      'message_id': 'MESSAGE_ID',
    };

    it('should NOT send call', () => {
      spyOn(logger, 'info');

      service.sendAcceptTimeout(null);

      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should NOT send call if not init calculate time', () => {
      spyOn(logger, 'info');

      service.sendAcceptTimeout('MESSAGE_ID');

      expect(logger.info).not.toHaveBeenCalledWith();
    });

    it('should send call with sending time', fakeAsync(() => {
      spyOn(logger, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000);

      service.sendAcceptTimeout(null);
      service.sendAcceptTimeout('MESSAGE_ID');

      expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
        ...commonLog, ...{
          'send_message_time': 1000,
          'metric_type': MetricTypeEnum.XMPP_ACCEPT_MESSAGE_TIME,
          'ping_time_ms': 0
        }
      }));
    }));

    it('should send call with sending time', fakeAsync(() => {
      spyOn(logger, 'info');
      spyOn(Date, 'now').and.returnValues(1000, 2000, 4000, 4000);

      service.sendAcceptTimeout(null);
      service.sendAcceptTimeout(null);
      service.sendAcceptTimeout('MESSAGE_ID');

      expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
        ...commonLog, ...{
          'send_message_time': 3000,
          'metric_type': MetricTypeEnum.XMPP_ACCEPT_MESSAGE_TIME,
          'ping_time_ms': 0
        }
      }));

      service.sendAcceptTimeout('MESSAGE_ID');

      expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
        ...commonLog, ...{
          'send_message_time': 2000,
          'metric_type': MetricTypeEnum.XMPP_ACCEPT_MESSAGE_TIME,
          'ping_time_ms': 0
        }
      }));
    }));
  });
});
