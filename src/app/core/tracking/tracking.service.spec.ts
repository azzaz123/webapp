import { inject, TestBed } from '@angular/core/testing';

import { TrackingService } from './tracking.service';
import { HttpService, NavigatorService, ShieldConfig, UserService, WindowRef } from 'shield';
import { RouterTestingModule } from '@angular/router/testing';

describe('TrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: HttpService, useValue: {}},
        {provide: TrackingService, useValue: {}},
        {provide: NavigatorService, useValue: {}},
        {provide: UserService, useValue: {}},
        {provide: WindowRef, useValue: {}},
        {provide: ShieldConfig, useValue: {}}
      ]
    });
  });

  it('should be created', inject([TrackingService], (service: TrackingService) => {
    expect(service).toBeTruthy();
  }));
});
