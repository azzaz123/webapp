import { TestBed } from '@angular/core/testing';
import { PaginationService } from './pagination.service';
import { of } from 'rxjs/internal/observable/of';
import { HttpResponse } from '@angular/common/http';
import { PaginatedList } from '@api/core/model/paginated-list.interface';

describe('PaginationService', () => {
  let paginationService: PaginationService;
  const httpResponseWithPaginationHeader = ({
    body: [],
    headers: {
      get(): string | null {
        return 'init=10';
      },
    },
  } as unknown) as HttpResponse<unknown[]>;

  const httpResponseWithoutPaginationHeader = ({
    body: [],
    headers: {
      get(): string | null {
        return null;
      },
    },
  } as unknown) as HttpResponse<unknown[]>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    paginationService = TestBed.inject(PaginationService);
  });

  it('should be created', () => {
    expect(paginationService).toBeTruthy();
  });

  describe('when getting list', () => {
    describe('and pagination header is present', () => {
      it('should return list with pagination parameter', () => {
        let response: PaginatedList<unknown>;

        paginationService.getList(of(httpResponseWithPaginationHeader)).subscribe((res) => (response = res));

        expect(response).toEqual({ list: [], paginationParameter: '10' });
      });
    });

    describe('and pagination header is not present', () => {
      it('should return list with null pagination parameter', () => {
        let response: PaginatedList<unknown>;

        paginationService.getList(of(httpResponseWithoutPaginationHeader)).subscribe((res) => (response = res));

        expect(response).toEqual({ list: [], paginationParameter: null });
      });
    });
  });
});
