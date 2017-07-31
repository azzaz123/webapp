import { TestBed, inject } from '@angular/core/testing';
import { TEST_HTTP_PROVIDERS, HttpService } from 'shield';
import { CategoryService } from './category.service';
import { Observable } from "rxjs/Observable";
let service: CategoryService;
let http: HttpService;

describe('CategoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryService, ...TEST_HTTP_PROVIDERS]
    });
    service = TestBed.get(CategoryService);
    http = TestBed.get(HttpService);
  });

  describe('getCategories', () => {
    it('should return an array of categories Observable', () => {
      service.getCategories().subscribe((data) => {
        expect(data.length).toBe(2);
        expect(data[0].id).toBe(100);
      })
    })
  });

  /*describe('getCategories', () => {
    it('should call the http.get', () => {
      spyOn(http, 'get');
      service.getCategories().subscribe(() => {
        expect(http.get).toHaveBeenCalled();
      })
    });
    it('should return the json from the categories', () => {
      spyOn(http, 'get').and.returnValue(Observable.of([{id: 100, name: 'Coches'}, {id: 2, name: 'Juegos'}]));
      service.getCategories().subscribe((data) => {
        expect(data.length).toBe(2);
        expect(data[0].id).toBe(100);
      })
    })
  });*/

});
