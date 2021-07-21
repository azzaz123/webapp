import { TestBed } from '@angular/core/testing';

import { FavouritesHttpService } from './favourites-http.service';

describe('FavouritesHttpService', () => {
  let service: FavouritesHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouritesHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
