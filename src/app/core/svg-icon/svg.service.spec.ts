import { TestBed } from '@angular/core/testing';
import { SvgService } from './svg.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

describe('SvgService', () => {
  let service: SvgService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SvgService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting svg icon...', () => {
    it('should get svg icon', () => {
      const expectedUrl = '/assets/icons/home.svg';
      const svg = '<svg></svg>';
      let response: string;

      service.getIconByPath(expectedUrl).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(svg);

      expect(req.request.url).toEqual(expectedUrl);
      expect(response).toEqual(svg);
      expect(req.request.method).toBe('GET');
    });
  });
});
