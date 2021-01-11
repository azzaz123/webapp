import { TestBed } from '@angular/core/testing';

import { ItemDetailService } from './item-detail.service';

describe('ItemDetailService', () => {
  let service: ItemDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
