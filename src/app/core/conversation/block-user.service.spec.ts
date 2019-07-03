import { TestBed } from '@angular/core/testing';

import { BlockUserService } from './block-user.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';

describe('BlockUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ...TEST_HTTP_PROVIDERS
    ]
  }));

  it('should be created', () => {
    const service: BlockUserService = TestBed.get(BlockUserService);
    expect(service).toBeTruthy();
  });
});
