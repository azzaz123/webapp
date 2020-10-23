import { TestBed } from '@angular/core/testing';
import { SvgService } from './svg.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SvgService', () => {
  let service: SvgService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(SvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIconByPath', () => {
    it('should call httpClient', () => {
      const path = 'svgPath';
      spyOn(httpClient, 'get').and.returnValue(of('svg'));

      service.getIconByPath(path);

      expect(httpClient.get).toHaveBeenCalledWith(
        path, {
        responseType: 'text'
      });
    });
  });
});
