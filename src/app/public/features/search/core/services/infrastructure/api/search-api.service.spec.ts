
import { HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchResponse, SearchResponseMapper } from '../search-response.interface';
import { NEXT_HEADER_PAGE, SearchApiService } from './search-api.service';
import { FilterParametersWallBuilder, SearchResponseBuilderByCategoryId, X_NEXT_PAGE_HEADER } from './search-api.service.fixture';


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
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get generic items and has more items', (done) => {
        const category_id = '1';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get generic items and has not more items', (done) => {
        const category_id = '1';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/general/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });


    describe('cars', () => {
      it('should call to wall cars', () => {
        const category_id = '100';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item cars and has more items', (done) => {
        const category_id = '100';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item cars and has not more items', (done) => {
        const category_id = '100';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

    });

    describe('realestate', () => {
      it('should call to realestate realestate', () => {
        const category_id = '200';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item realestates and has more items', (done) => {
        const category_id = '200';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item realestates and has not more items', (done) => {
        const category_id = '200';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });

    describe('fashion', () => {
      it('should call to wall fashion', () => {
        const category_id = '12465';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);
        service.search(filters).subscribe();

        const request = httpController.expectOne(`/api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });

      it('should get item fashion and has more items', (done) => {
        const category_id = '12465';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: true});
          done();
        });

        const request = httpController.expectOne(`/api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse, {
          headers: new HttpHeaders().set(NEXT_HEADER_PAGE, X_NEXT_PAGE_HEADER(category_id))
        });
      });

      it('should get item fashion and has not more items', (done) => {
        const category_id = '12465';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id);

        service.search(filters).subscribe((response) => {
          expect(response).toEqual({items: SearchResponseMapper(searchResponse), hasMore: false});
          done();
        });

        const request = httpController.expectOne(`/api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush(searchResponse);
      });
    });
  });

});

