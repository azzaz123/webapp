import { TestBed } from '@angular/core/testing';

import { UserScheduleApiService } from './user-schedule-api.service';

describe('UserScheduleApiService', () => {
  let service: UserScheduleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserScheduleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
