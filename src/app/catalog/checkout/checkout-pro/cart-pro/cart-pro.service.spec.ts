import { TestBed, inject } from '@angular/core/testing';

import { CartProService } from './cart-pro.service';

describe('CartProService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartProService]
    });
  });

  it('should be created', inject([CartProService], (service: CartProService) => {
    expect(service).toBeTruthy();
  }));
});
