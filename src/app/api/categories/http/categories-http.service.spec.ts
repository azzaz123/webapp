import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { CategoryDto } from '../dtos';
import { CategoriesHttpService } from './categories-http.service';
import { CATEGORIES_ENDPOINT } from './endpoints';
import { categoriesFixture } from '@api/fixtures/categories/categories.fixtures';

describe('CategoriesHttpService', () => {
  let service: CategoriesHttpService;
  let httpMock: HttpTestingController;
  const CONTEXT_PARAM = 'context';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriesHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CategoriesHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve search categories', () => {
    it('should retrieve search categories', () => {
      let response: CategoryDto[];
      const context = 'search';

      service.getCategories(context).subscribe((res: CategoryDto[]) => (response = res));
      const req: TestRequest = httpMock.expectOne(`${CATEGORIES_ENDPOINT}?${CONTEXT_PARAM}=${context}`);
      req.flush(categoriesFixture);

      expect(response).toEqual(categoriesFixture);
      expect(req.request.params.get(CONTEXT_PARAM)).toEqual(context);
    });
  });

  describe('when asked to retrieve upload categories', () => {
    it('should retrieve upload categories', () => {
      let response: CategoryDto[];
      const context = 'upload';

      service.getCategories(context).subscribe((res: CategoryDto[]) => (response = res));
      const req: TestRequest = httpMock.expectOne(`${CATEGORIES_ENDPOINT}?${CONTEXT_PARAM}=${context}`);
      req.flush(categoriesFixture);

      expect(response).toEqual(categoriesFixture);
      expect(req.request.params.get(CONTEXT_PARAM)).toEqual(context);
    });
  });
});
