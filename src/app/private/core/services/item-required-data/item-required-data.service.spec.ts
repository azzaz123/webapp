import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ItemRequiredDataService } from './item-required-data.service';

describe('ItemRequiredDataService', () => {
  let service: ItemRequiredDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemRequiredDataService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ItemRequiredDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
