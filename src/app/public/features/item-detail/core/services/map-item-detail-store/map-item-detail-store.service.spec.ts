import { TestBed } from '@angular/core/testing';
import { MapItemDetailStoreService } from './map-item-detail-store.service';

describe('MapItemDetailStoreService', () => {
  let service: MapItemDetailStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapItemDetailStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
