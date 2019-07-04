import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BlockUserService } from './block-user.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';

describe('BlockUserService', () => {
  const USER_ID = '7s6gwr3c54s';

  let httpTestingController: HttpTestingController;
  let service: BlockUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlockUserService,
        ...TEST_HTTP_PROVIDERS
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(BlockUserService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO FRON-82 replace xit to it after change http client from Http to HttpClient
  xit('should block user', () => {
    service.blockUser(USER_ID).subscribe();

    const req = httpTestingController.expectOne('api/v3/instant-messaging/privacy/user');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ block_user_hashes: [USER_ID] });
  });

  // TODO FRON-82 replace xit to it after change http client from Http to HttpClient
  xit('should unblock user', () => {
    service.blockUser(USER_ID).subscribe();

    const req = httpTestingController.expectOne('api/v3/instant-messaging/privacy/user');
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual({ unblock_user_hashes: [USER_ID] });
  });
});
