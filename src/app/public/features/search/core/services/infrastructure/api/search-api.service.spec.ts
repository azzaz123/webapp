
import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchResponse, SearchResponseMapper } from '../search-response.interface';
import { NEXT_HEADER_PAGE, SearchApiService } from './search-api.service';
import { FilterParametersWallFactory, SearchResponseByCategoryIdFactory, X_NEXT_PAGE_HEADER } from './search-api.service.fixture';


describe('SearchApiService', () => {
  let service: SearchApiService;
  let httpController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchApiService]
    });

    service = TestBed.inject(SearchApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  describe('when we want to search...', () => {

    describe('generic category', () => {
      it('should call to wall generic ', () => {
        const category_id = '1';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get generic items and has more items', (done) => {
        const category_id = '1';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get generic items and has not more items', (done) => {
        const category_id = '1';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });


    describe('cars', () => {
      it('should call to wall cars', () => {
        const category_id = '100';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item cars and has more items', (done) => {
        const category_id = '100';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item cars and has not more items', (done) => {
        const category_id = '100';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

    });

    describe('realestate', () => {
      it('should call to realestate realestate', () => {
        const category_id = '200';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item realestates and has more items', (done) => {
        const category_id = '200';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item realestates and has not more items', (done) => {
        const category_id = '200';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });

    describe('fashion', () => {
      it('should call to wall fashion', () => {
        const category_id = '12465';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);
        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item fashion and has more items', (done) => {
        const category_id = '12465';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item fashion and has not more items', (done) => {
        const category_id = '12465';
        const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
        const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });
  });

  describe('when we want to load more items', () => {

    it('should return null if does not has more items', () => {
      service.loadMore();

      httpController.expectNone('/api/v3/general/wall');
    });

    it('should load next page', () => {
      const category_id = '1';
      const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
      const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id);
      service.search(filters).subscribe();
      const request = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
      request.flush(searchResponse, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
      });

      service.loadMore().subscribe();

      const requestLoadMore = httpController.expectOne(`/api/v3/general/wall?${X_NEXT_PAGE_HEADER(category_id)}`);
      expect(requestLoadMore.request.method).toBe('GET');
      requestLoadMore.flush(searchResponse);
    });
  });

  describe('when the list is less than 20 items', () => {
    it('show load more items', () => {
      const category_id = '1';
      const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
      const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id, 20);

      service.search(filters).subscribe()

      const request1 = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
      expect(request1.request.method).toBe('GET');
      request1.flush(searchResponse, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
      });

      const request2 = httpController.expectOne(`/api/v3/general/wall?${X_NEXT_PAGE_HEADER(category_id)}`);
      expect(request2.request.method).toBe('GET');
      request2.flush(searchResponse);
    });

    it('show load more items until 40 items length', (done) => {
      const category_id = '1';
      const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
      const searchResponse: SearchResponse = SearchResponseByCategoryIdFactory(category_id, 20);

      service.search(filters).subscribe((response) => {
        expect(response).toEqual({
          items: [...SearchResponseMapper(searchResponse), ...SearchResponseMapper(searchResponse)],
          hasMore: false
        });
        done();
      })

      const request1 = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`);
      expect(request1.request.method).toBe('GET');
      request1.flush(searchResponse, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
      });
      const request2 = httpController.expectOne(`/api/v3/general/wall?${X_NEXT_PAGE_HEADER(category_id)}`);
      expect(request2.request.method).toBe('GET');
      request2.flush(searchResponse);
    });
  });

});

