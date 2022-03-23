import { TestBed } from '@angular/core/testing';

import { DrawerNavigationSectionsService } from './drawer-navigation-sections.service';

describe('DrawerNavigationSectionsService', () => {
  let service: DrawerNavigationSectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawerNavigationSectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
