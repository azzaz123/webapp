import { TestBed } from '@angular/core/testing';
import { MapRecommendedItemCardService } from './map-recommended-item-card.service';

describe('MapRecommendedItemCardService', () => {
  let service: MapRecommendedItemCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapRecommendedItemCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we map an item response...', () => {
    it('should return the correct mapped item card', () => {});

    describe(`and the item have images`, () => {
      it('should set the first image as main image', () => {});
    });

    describe(`and the item doesn't have images`, () => {
      it('should set the content image as main image', () => {});
    });
  });

  describe('when we map an item response...', () => {
    it('should return the correct mapped item card', () => {});
  });
});
