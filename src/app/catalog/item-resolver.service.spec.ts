import { TestBed, inject } from '@angular/core/testing';

import { ItemResolverService } from './item-resolver.service';

describe('ItemResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemResolverService]
    });
  });

  it('should be created', inject([ItemResolverService], (service: ItemResolverService) => {
    expect(service).toBeTruthy();
  }));
});
