import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BlockUserService } from './block-user.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';

fdescribe('BlockUserService', () => {
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
});
