import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RemoteConsoleService } from './remote-console.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DeviceDetectorServiceMock } from '../../../tests';
import * as logger from 'loglevel';

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
    const USER_ID = 'USER_ID';
    const CONNECTION_TIME = 1000;
    spyOn(logger, 'info');

    service.sendConnectionTimeout(USER_ID, CONNECTION_TIME);

    expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
      'browser': 'CHROME',
      'browser_version': '76.0.3809.132',
      'user_id': USER_ID,
      'metric_type': 'XMPP_CONNECTION_TIME',
      'message': 'xmpp connection time',
      'connection_time': CONNECTION_TIME,
      'connection_type': '',
      'ping_time_ms': 0
    }));
  });

  it('should call xmpp conection with parameters', () => {
    const USER_ID = 'USER_ID';
    const CONVERSATIONS_BY_ID = new Map();
    CONVERSATIONS_BY_ID['xa4ld642'] = 2;
    spyOn(logger, 'info');

    service.sendDuplicateConversations(USER_ID, CONVERSATIONS_BY_ID);

    expect(logger.info).toHaveBeenCalledWith(JSON.stringify({
      'browser': 'CHROME',
      'browser_version': '76.0.3809.132',
      'user_id': 'USER_ID',
      'metric_type': 'DUPLICATE_CONVERSATION',
      'message': 'send log when user see duplicate conversation in inbox',
      'conversations_group_by_id': { 'xa4ld642': 2 }
    }));
  });
});
