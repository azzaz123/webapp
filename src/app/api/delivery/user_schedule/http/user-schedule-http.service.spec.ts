import { TestBed } from '@angular/core/testing';

import { UserScheduleHttpService } from './user-schedule-http.service';

describe('UserScheduleHttpService', () => {
  let service: UserScheduleHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserScheduleHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
