import { TestBed } from '@angular/core/testing';

import { CatalogHttpService } from './catalog-http.service';
import { PublishedResponse } from '@api/catalog/dtos/published/published-response';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { catalogResponseFixture } from '@api/fixtures/catalog/catalog-response.fixtures';

describe('CatalogHttpService', () => {
  let service: CatalogHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CatalogHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve user published items', () => {
    it('should retrieve user published items', () => {
      let response: PublishedResponse;
      const userId = 'id';

      service.getUserPublishedItems(userId).subscribe((res: PublishedResponse) => (response = res));

      const req: TestRequest = httpMock.expectOne(`${environment.baseUrl}api/v3/users/${userId}/items`);
      req.flush(catalogResponseFixture);

      expect(response).toEqual(catalogResponseFixture);
    });
  });
});
