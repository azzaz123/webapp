import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../../../../environments/environment';

import { BlockUserService } from './block-user.service';

describe('BlockUserService', () => {
  const USER_ID = '7s6gwr3c54s';

  let httpMock: HttpTestingController;
  let service: BlockUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BlockUserService,
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(BlockUserService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should block user', () => {
    service.blockUser(USER_ID).subscribe();

    const req = httpMock.expectOne(`${environment.baseUrl}${BlockUserService.BLOCK_USER_ENDPOINT}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual({ block_user_hashes: [USER_ID] });
  });

  it('should unblock user', () => {
    service.unblockUser(USER_ID).subscribe();

    const req = httpMock.expectOne(`${environment.baseUrl}${BlockUserService.BLOCK_USER_ENDPOINT}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual({ unblock_user_hashes: [USER_ID] });
  });
});
