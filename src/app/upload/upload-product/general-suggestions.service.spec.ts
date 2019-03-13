import { fakeAsync, TestBed } from '@angular/core/testing';

import { GeneralSuggestionsService } from './general-suggestions.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { HttpService } from '../../core/http/http.service';
import { IOption } from 'ng-select';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

describe('GeneralSuggestionsService', () => {

  let service: GeneralSuggestionsService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeneralSuggestionsService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(GeneralSuggestionsService);
    http = TestBed.get(HttpService);
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  // describe('getObjectTypes', () => {
  //   let response: IOption[];
  //   const CATEGORY = '1';

  //   beforeEach(fakeAsync(() => {
  //     const OBJECT_TYPES = [{
  //       id: '1',
  //       name: 'name1'
  //     }, {
  //       id: '2',
  //       name: 'name2'
  //     }];
  //     const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(OBJECT_TYPES)});
  //     spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

  //     service.getObjectTypes(CATEGORY).subscribe((r: IOption[]) => {
  //       response = r;
  //     });
  //   }));

  //   it('should call endpoint', () => {
  //     expect(http.get).toHaveBeenCalledWith('api/v3/suggesters/general/object-type', {category_id: CATEGORY});
  //   });

  //   it('should return options', () => {
  //     expect(response).toEqual([{
  //       value: '1',
  //       label: 'name1'
  //     }, {
  //       value: '2',
  //       label: 'name2'
  //     }]);
  //   });
  // });

  // describe('getBrands', () => {
  //   let response: IOption[];
  //   const CATEGORY = '1';
  //   const OBJECT_TYPE_ID = '2';

  //   beforeEach(fakeAsync(() => {
  //     const OBJECT_TYPES = [{
  //       brand: 'brand1'
  //     }, {
  //       brand: 'brand2'
  //     }];
  //     const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(OBJECT_TYPES)});
  //     spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

  //     service.getBrands(CATEGORY, OBJECT_TYPE_ID).subscribe((r: IOption[]) => {
  //       response = r;
  //     });
  //   }));

  //   it('should call endpoint', () => {
  //     expect(http.get).toHaveBeenCalledWith('api/v3/suggesters/general/brand', {category_id: CATEGORY, object_type_id: OBJECT_TYPE_ID});
  //   });

  //   it('should return options', () => {
  //     expect(response).toEqual([{
  //       value: 'brand1',
  //       label: 'brand1'
  //     }, {
  //       value: 'brand2',
  //       label: 'brand2'
  //     }]);
  //   });
  // });

  // describe('getModels', () => {
  //   let response: IOption[];
  //   const CATEGORY = '1';
  //   const OBJECT_TYPE_ID = '2';

  //   beforeEach(fakeAsync(() => {
  //     const OBJECT_TYPES = [{
  //       model: 'model1'
  //     }, {
  //       model: 'model2'
  //     }];
  //     const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(OBJECT_TYPES)});
  //     spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

  //     service.getModels(CATEGORY, OBJECT_TYPE_ID).subscribe((r: IOption[]) => {
  //       response = r;
  //     });
  //   }));

  //   it('should call endpoint', () => {
  //     expect(http.get).toHaveBeenCalledWith('api/v3/suggesters/general/brand-model', {category_id: CATEGORY, object_type_id: OBJECT_TYPE_ID});
  //   });

  //   it('should return options', () => {
  //     expect(response).toEqual([{
  //       value: 'model1',
  //       label: 'model1'
  //     }, {
  //       value: 'model2',
  //       label: 'model2'
  //     }]);
  //   });
  // });
});
