import { TestBed, inject } from '@angular/core/testing';

import { ItemStatsService } from './item-stats.service';

describe('ItemStatsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemStatsService]
    });
  });

  it('should be created', inject([ItemStatsService], (service: ItemStatsService) => {
    expect(service).toBeTruthy();
  }));
});
