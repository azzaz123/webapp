import { TestBed } from '@angular/core/testing';

import { CatalogHttpService } from './catalog-http.service';
import { PublishedResponse } from '@api/catalog/dtos/published/published-response';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { publishedResponseFixture } from '@api/fixtures/catalog/published/published-response.fixtures';
import { WallResponse } from '@api/catalog/dtos';
import { Location } from '@api/core/model/location/location';
import { wallResponseFixture } from '@api/fixtures/catalog/wall/wall-response.fixtures';

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
      req.flush(publishedResponseFixture);

      expect(response).toEqual(publishedResponseFixture);
    });
  });

  describe('when asked to retrieve wall items', () => {
    it('should wall items', () => {
      let response: WallResponse;
      const location: Location = {
        latitude: 0,
        longitude: 0,
      };

      service.getWallItems(location).subscribe((res: WallResponse) => (response = res));

      const req: TestRequest = httpMock.expectOne(`${environment.baseUrl}api/v3/wall`);
      req.flush(wallResponseFixture);

      expect(response).toEqual(wallResponseFixture);
    });
  });
});
