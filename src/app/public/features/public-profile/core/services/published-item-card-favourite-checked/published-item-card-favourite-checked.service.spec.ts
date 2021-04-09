import { TestBed } from '@angular/core/testing';

import { PublishedItemCardFavouriteCheckedService } from './published-item-card-favourite-checked.service';

describe('PublishedItemCardFavouriteCheckedService', () => {
  let service: PublishedItemCardFavouriteCheckedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublishedItemCardFavouriteCheckedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
