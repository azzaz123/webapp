import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { filtersWall } from './search-api-url.factory';
import { SearchApiService } from './search-api.service';


function FilterParametersWallBuilder(categoryId: string): FilterParameter[] {
  return filtersWall.map((key: string) => ({key, value: key === 'category_ids' ? categoryId : `${key}-value`}));
}

function FilterParametersSearchBuilder(categoryId: string, search: string): FilterParameter[] {
  return [...filtersWall, 'keywords'].map((key: string) => ({key, value: key === 'category_ids' ? categoryId : `${key}-value`}));
}

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
        const filters: FilterParameter[] = FilterParametersWallBuilder('1');

        service.search(filters).subscribe();

        const request = httpController.expectOne('/api/v3/general/wall?category_ids=1&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value');
        expect(request.request.method).toBe('GET');
        request.flush('');
      });
    });


    describe('cars', () => {
      it('should call to wall cars', () => {
        const filters: FilterParameter[] = FilterParametersWallBuilder('100');

        service.search(filters).subscribe();

        const request = httpController.expectOne('/api/v3/cars/wall?category_ids=100&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value');
        expect(request.request.method).toBe('GET');
        request.flush('');
      });

    });

    describe('realestate', () => {
      it('should call to wall realestate', () => {
        const filters: FilterParameter[] = FilterParametersWallBuilder('200');

        service.search(filters).subscribe();

        const request = httpController.expectOne('/api/v3/real_estate/wall?category_ids=200&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value');
        expect(request.request.method).toBe('GET');
        request.flush('');
      });
    });

    describe('fashion', () => {
      it('should call to wall fashion', () => {
        const filters: FilterParameter[] = FilterParametersWallBuilder('12465');

        service.search(filters).subscribe();

        const request = httpController.expectOne('/api/v3/fashion/wall?category_ids=12465&latitude=latitude-value&longitude=longitude-value&filters_source=filters_source-value&language=language-value');
        expect(request.request.method).toBe('GET');
        request.flush('');
      });
    });
  });

});
