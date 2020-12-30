import { TestBed } from '@angular/core/testing';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let paginationService: PaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    paginationService = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(paginationService).toBeTruthy();
  });

  describe('getPaginationRequestOptions', () => {
    const defaultReturn = {
      params: {
        init: 0,
      } as any,
      observe: 'response' as 'body',
    };

    it('should return default response if no init param', () => {
      const result = paginationService.getPaginationRequestOptions(null);

      expect(result).toEqual(defaultReturn);
    });

    it('should return default response with param as params.init', () => {
      const randomNum = 22;
      defaultReturn.params.init = randomNum;

      const result = paginationService.getPaginationRequestOptions(randomNum);

      expect(result).toEqual(defaultReturn);
    });
  });
});
