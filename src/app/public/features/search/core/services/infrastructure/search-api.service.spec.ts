import { SearchResponse, SearchResponseMapper } from './search-response.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchApiService } from './search-api.service';
import { FilterParametersWallBuilder, SearchResponseBuilder, SearchResponseBuilderByCategoryId } from './search-api.service.fixture';


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

        service.search(filters).subscribe((response) => {
          expect(response).toEqual(SearchResponseMapper(searchResponse));
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
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id)

        service.search(filters).subscribe((response) => {
          expect(response).toEqual(SearchResponseMapper(searchResponse));
        });

        const request = httpController.expectOne(`/api/v3/cars/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush('');
      });

    });

    describe('realestate', () => {
      it('should call to wall realestate', () => {
        const category_id = '200';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id)

        service.search(filters).subscribe((response) => {
          expect(response).toEqual(SearchResponseMapper(searchResponse));
        });

        const request = httpController.expectOne(`/api/v3/real_estate/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush('');
      });
    });

    describe('fashion', () => {
      it('should call to wall fashion', () => {
        const category_id = '12465';
        const filters: FilterParameter[] = FilterParametersWallBuilder(category_id);
        const searchResponse: SearchResponse = SearchResponseBuilderByCategoryId(category_id)
        service.search(filters).subscribe((response) => {
          expect(response).toEqual(SearchResponseMapper(searchResponse));
        });

        const request = httpController.expectOne(`/api/v3/fashion/wall?category_ids=${category_id}&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value`);
        expect(request.request.method).toBe('GET');
        request.flush('');
      });
    });
  });

});

