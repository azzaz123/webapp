import { TestBed } from '@angular/core/testing';

import { ReviewsHttpService } from './reviews-http.service';

describe('ReviewsHttpService', () => {
  let service: ReviewsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
