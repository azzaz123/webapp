import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { environment } from '@environments/environment';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchCarResponse } from '../cars/search-car-response';
import { SearchItemCarResponseMapper } from '../cars/search-cars-response.mapper';
import { SearchCustomerGoodsResponse } from '../customer-goods/search-costumer-goods-response.interface';
import { SearchItemCustomerGoodsResponseMapper } from '../customer-goods/search-customer-goods-response.mapper';
import { SearchRealEstateResponse } from '../real_estate/search-item-real-state-response';
import { searchItemRealEstateResponseMapper } from '../real_estate/search-real-estate-response.mapper';
import { NEXT_HEADER_PAGE, SearchAPIService } from './search-api.service';
import {
  FilterParametersWallFactory,
  SearchCarItemListResponseFactory,
  SearchCustomerGoodsItemListResponseFactory,
  SearchRealEstateItemlistResponseFactory,
  SearchResponseFactory,
  X_NEXT_PAGE_HEADER
} from './search-api.service.fixture';
import { SearchResponse } from './search-response.interface';


describe('SearchApiService', () => {
  let service: SearchAPIService;
  let httpController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchAPIService]
    });

    service = TestBed.inject(SearchAPIService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should initialize', () => {
    expect(service).toBeTruthy();
  });

  describe('when we want to search...', () => {

    describe('generic category', () => {
      const category_id = '1';
      const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
      const searchResponse: SearchResponse<SearchCustomerGoodsResponse> = SearchResponseFactory<SearchCustomerGoodsResponse>({
        search_objects: SearchCustomerGoodsItemListResponseFactory()
      });

      it('should call to wall generic ', () => {
        const expectedUrl = `${environment.baseUrl}api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe();

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get generic items and has more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchItemCustomerGoodsResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get generic items and has not more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchItemCustomerGoodsResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });


    describe('cars', () => {
      const category_id = CATEGORY_IDS.CAR.toString();
      const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
      const searchResponse: SearchResponse<SearchCarResponse> = SearchResponseFactory<SearchCarResponse>({
        search_objects: SearchCarItemListResponseFactory()
      });
      it('should call to wall cars', () => {
        const expectedUrl = `${environment.baseUrl}api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;
        service.search(filters).subscribe();

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item cars and has more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchItemCarResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item cars and has not more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchItemCarResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

    });

    describe('realestate', () => {
      const category_id = CATEGORY_IDS.REAL_ESTATE.toString();
      const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
      const searchResponse: SearchResponse<SearchRealEstateResponse> = SearchResponseFactory<SearchRealEstateResponse>({
        search_objects: SearchRealEstateItemlistResponseFactory()
      });

      it('should call to realestate realestate', () => {
        const expectedUrl = `${environment.baseUrl}api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe();

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item realestates and has more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: searchItemRealEstateResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item realestates and has not more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: searchItemRealEstateResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });

    describe('fashion', () => {
      const category_id: string = CATEGORY_IDS.FASHION_ACCESSORIES.toString();
      const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
      const searchResponse: SearchResponse<SearchCustomerGoodsResponse> = SearchResponseFactory<SearchCustomerGoodsResponse>({
        search_objects: SearchCustomerGoodsItemListResponseFactory()
      });

      it('should call to wall fashion', () => {
        const expectedUrl = `${environment.baseUrl}api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe();

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item fashion and has more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchItemCustomerGoodsResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item fashion and has not more items', (done) => {
        const expectedUrl = `${environment.baseUrl}api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchItemCustomerGoodsResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(expectedUrl);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });
  });

  describe('when we want to load more items', () => {
    const category_id = '1';
    const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
    const searchResponse: SearchResponse<SearchCustomerGoodsResponse> = SearchResponseFactory<SearchCustomerGoodsResponse>({
      search_objects: SearchCustomerGoodsItemListResponseFactory()
    });
    it('should return null if does not has more items', () => {
      const expectedUrl = `${environment.baseUrl}api/v3/general/wall`;

      service.loadMore();

      httpController.expectNone(expectedUrl);
    });

    it('should load next page', () => {
      const expectedUrlSearch = `${environment.baseUrl}api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;
      const expectedUrlLoadMore = `${environment.baseUrl}api/v3/general/wall?${X_NEXT_PAGE_HEADER(category_id)}`;

      service.search(filters).subscribe();
      const request = httpController.expectOne(expectedUrlSearch);
      request.flush(searchResponse, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
      });

      service.loadMore().subscribe();

      const requestLoadMore = httpController.expectOne(expectedUrlLoadMore);
      expect(requestLoadMore.request.method).toBe('GET');
      requestLoadMore.flush(searchResponse);
    });
  });

  describe('when the list is less than 20 items', () => {
    const category_id = '1';
    const filters: FilterParameter[] = FilterParametersWallFactory(category_id);
    const searchResponse: SearchResponse<SearchCustomerGoodsResponse> = SearchResponseFactory<SearchCustomerGoodsResponse>({
      search_objects: SearchCustomerGoodsItemListResponseFactory(20)
    });

    it('show load more items', () => {
      const expectedUrlSearch = `${environment.baseUrl}api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;
      const expectedUrlLoadMore = `${environment.baseUrl}api/v3/general/wall?${X_NEXT_PAGE_HEADER(category_id)}`;
      service.search(filters).subscribe();

      const request1 = httpController.expectOne(expectedUrlSearch);
      expect(request1.request.method).toBe('GET');
      request1.flush(searchResponse, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
      });

      const request2 = httpController.expectOne(expectedUrlLoadMore);
      expect(request2.request.method).toBe('GET');
      request2.flush(searchResponse);
    });

    it('show load more items until 40 items length', (done) => {
      const expectedUrlSearch = `${environment.baseUrl}api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value`;
      const expectedUrlLoadMore = `${environment.baseUrl}api/v3/general/wall?${X_NEXT_PAGE_HEADER(category_id)}`;

      service.search(filters).subscribe((response) => {
        expect(response).toEqual({
          items: [...SearchItemCustomerGoodsResponseMapper(searchResponse), ...SearchItemCustomerGoodsResponseMapper(searchResponse)],
          hasMore: false
        });
        done();
      });

      const request1 = httpController.expectOne(expectedUrlSearch);
      expect(request1.request.method).toBe('GET');
      request1.flush(searchResponse, {
        headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
      });
      const request2 = httpController.expectOne(expectedUrlLoadMore);
      expect(request2.request.method).toBe('GET');
      request2.flush(searchResponse);
    });
  });

});

