import { TestBed } from '@angular/core/testing';

import { FilterOptionService } from './filter-option.service';
import { FilterOptionServiceModule } from './filter-option-service.module';

describe('FilterOptionService', () => {
  let service: FilterOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FilterOptionServiceModule],
    });
    service = TestBed.inject(FilterOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for hardcoded options', () => {
    it('should retrieve correct options', () => {});
  });

  describe('when asked for backend options', () => {
    describe('in relation with retrieved format...', () => {
      describe('retrieved options are in the correct format (no mapper method)', () => {});

      describe('retrieved options are in an incorrect format (mapper method)', () => {});
    });

    describe('in relation with other filters...', () => {
      describe('and endpoint does not need info from other filters', () => {});

      describe('and endpoint needs info from other filters', () => {});
    });
  });
});
