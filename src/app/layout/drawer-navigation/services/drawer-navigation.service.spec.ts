import { TestBed } from '@angular/core/testing';

import { DrawerNavigationService } from './drawer-navigation.service';

describe('DrawerNavigationService', () => {
  let service: DrawerNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawerNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
