import { TestBed } from '@angular/core/testing';
import { FilterWrapperConfigurationService } from './filter-wrapper-configuration.service';

describe('FilterConfigurationService', () => {
  let service: FilterWrapperConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterWrapperConfigurationService],
    });
    service = TestBed.inject(FilterWrapperConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
