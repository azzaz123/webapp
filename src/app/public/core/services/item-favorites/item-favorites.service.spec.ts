import { TestBed } from '@angular/core/testing';

import { ItemFavoritesService } from './item-favorites.service';

describe('ItemFavoritesService', () => {
  let service: ItemFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemFavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
