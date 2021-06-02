import { TestBed } from '@angular/core/testing';

import { HashtagSuggestionsService } from './hashtag-suggestions.service';

describe('HashtagSuggestionsService', () => {
  let service: HashtagSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HashtagSuggestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
