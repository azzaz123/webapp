/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { NavigatorService } from './navigator.service';

describe('NavigatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigatorService],
    });
  });

  it('should ...', inject([NavigatorService], (service: NavigatorService) => {
    expect(service).toBeTruthy();
  }));
});
