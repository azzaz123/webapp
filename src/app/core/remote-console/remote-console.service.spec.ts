import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RemoteConsoleService } from './remote-console.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceDetectorServiceMock, FeatureFlagServiceMock } from '../../../tests';
import * as logger from 'loglevel';
import { FeatureflagService } from '../user/featureflag.service';

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
        { provide: FeatureflagService, useClass: FeatureFlagServiceMock }
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

  xit('should call xmpp conection with parameters', () => {
    const USER_ID = 'USER_ID';
    const CONNECTION_TIME = 1000;
    spyOn(logger, 'info');

    service.sendConnectionTimeout(USER_ID, CONNECTION_TIME);

    expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
      'browser': 'CHROME',
      'browser_version': '76.0.3809.132',
      'user_id': USER_ID,
      'feature_flag': true,
      'version': '5.78.0',
      'metric_type': 'XMPP_CONNECTION_TIME',
      'message': 'xmpp connection time',
      'connection_time': CONNECTION_TIME,
      'connection_type': '',
      'ping_time_ms': 0
    }));
  });

  xit('should call duplicated conversation conection with parameters', () => {
    const USER_ID = 'USER_ID';
    const CONVERSATIONS_BY_ID = new Map();
    const LOAD_MORE_CONVERSATIONS = 'LOAD_INBOX';
    CONVERSATIONS_BY_ID['xa4ld642'] = 2;
    spyOn(logger, 'info');

    service.sendDuplicateConversations(USER_ID, LOAD_MORE_CONVERSATIONS, CONVERSATIONS_BY_ID);

    expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
      'browser': 'CHROME',
      'browser_version': '76.0.3809.132',
      'user_id': 'USER_ID',
      'feature_flag': true,
      'version': '5.78.0',
      'metric_type': 'DUPLICATE_CONVERSATION',
      'message': 'send log when user see duplicate conversation in inbox',
      'call_method_client': 'LOAD_INBOX',
      'conversations_count_by_id': JSON.stringify({ 'xa4ld642': 2 })
    }));
  });
});
