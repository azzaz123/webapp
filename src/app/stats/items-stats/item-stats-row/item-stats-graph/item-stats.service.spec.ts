import { TestBed, inject } from '@angular/core/testing';

import { ItemStatsService } from './item-stats.service';
import { TEST_HTTP_PROVIDERS } from '../../../../../tests/utils.spec';

describe('ItemStatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ItemStatsService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
  });

  it('should be created', inject([ItemStatsService], (service: ItemStatsService) => {
    expect(service).toBeTruthy();
  }));
});
