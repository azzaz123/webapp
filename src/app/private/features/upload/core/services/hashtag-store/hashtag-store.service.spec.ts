import { TestBed } from '@angular/core/testing';

import { HashtagStoreService } from './hashtag-store.service';

describe('HashtagStoreService', () => {
  let service: HashtagStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashtagStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
