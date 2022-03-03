import { TestBed } from '@angular/core/testing';

import { BottomNavigationBarService } from './bottom-navigation-bar.service';

describe('BottomNavigationBarService', () => {
  let service: BottomNavigationBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BottomNavigationBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
