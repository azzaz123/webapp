import { TestBed } from '@angular/core/testing';
import { RecommenderItemCardFavouriteCheckedService } from './recommender-item-card-favorite-checked.service';

describe('RecommenderItemCardFavouriteCheckedService', () => {
  let service: RecommenderItemCardFavouriteCheckedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommenderItemCardFavouriteCheckedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
