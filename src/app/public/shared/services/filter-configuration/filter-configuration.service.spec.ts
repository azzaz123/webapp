import { TestBed } from '@angular/core/testing';
import { FilterConfigurationService } from './filter-configuration.service';

describe('FilterConfigurationService', () => {
  let service: FilterConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterConfigurationService],
    });
    service = TestBed.inject(FilterConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
