import { TestBed } from '@angular/core/testing';
import { SvgService } from './svg.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

describe('SvgService', () => {
  let service: SvgService;
  let httpMock: HttpTestingController;
  const iconPath = '/assets/icons/home.svg';
  const emptySvg = `<svg></svg>`;

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

  describe('when requesting svg icon', () => {
    describe('and when the icon is not cached in memory', () => {
      it('should do a network request to get the icon', () => {
        const expectedUrl = iconPath;
        let response: string;

        service.getIconByPath(expectedUrl).subscribe((r) => (response = r));
        const req: TestRequest = httpMock.expectOne(expectedUrl);
        req.flush(emptySvg);

        expect(req.request.url).toEqual(expectedUrl);
        expect(response).toEqual(emptySvg);
        expect(req.request.method).toBe('GET');
      });
    });

    describe('and when the icon is cached in memory', () => {
      it('should not do an extra network request', () => {
        service.getIconByPath(iconPath).subscribe();
        httpMock.expectOne(iconPath).flush(emptySvg);

        service.getIconByPath(iconPath).subscribe();

        httpMock.expectNone(iconPath);
      });
    });
  });
});
