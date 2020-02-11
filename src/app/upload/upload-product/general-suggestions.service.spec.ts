import { fakeAsync, TestBed } from '@angular/core/testing';

import { GeneralSuggestionsService } from './general-suggestions.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { HttpService } from '../../core/http/http.service';
import { IOption } from 'ng-select';
import { ResponseOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { BrandModel, Brand, Model, SizesResponse } from '../brand-model.interface';
import { I18nService } from '../../core/i18n/i18n.service';

describe('GeneralSuggestionsService', () => {

  let service: GeneralSuggestionsService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GeneralSuggestionsService,
        I18nService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(GeneralSuggestionsService);
    http = TestBed.get(HttpService);
  });

  describe('getObjectTypes', () => {
    let response: IOption[];
    const categoryId = 1;

    beforeEach(fakeAsync(() => {
      const OBJECT_TYPES = [{
        id: '1',
        name: 'name1'
      }, {
        id: '2',
        name: 'name2'
      }];
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(OBJECT_TYPES) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getObjectTypes(categoryId).subscribe((r: IOption[]) => {
        response = r;
      });
    }));

    it('should call the object-type endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(`${service['API_URL']}/object-type`, { category_id: categoryId, language: 'en' });
    });

    it('should return the object type options', () => {
      expect(response).toEqual([{
        value: '1',
        label: 'name1'
      }, {
        value: '2',
        label: 'name2'
      }]);
    });
  });

  describe('getBrandsAndModels', () => {
    let response: BrandModel[];
    const CATEGORY = 1;
    const OBJECT_TYPE_ID = 2;
    const SUGGESTION = 'suggestion';

    beforeEach(fakeAsync(() => {
      const BRAND_MODELS: BrandModel[] = [{
        brand: 'brand1',
        model: 'model1'
      }, {
        brand: 'brand2',
        model: 'model2'
      }];
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(BRAND_MODELS) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getBrandsAndModels(SUGGESTION, CATEGORY, OBJECT_TYPE_ID).subscribe((r: BrandModel[]) => {
        response = r;
      });
    }));

    it('should call the brand-model endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(`${service['API_URL']}/brand-model`,
        { text: SUGGESTION, category_id: CATEGORY, object_type_id: OBJECT_TYPE_ID });
    });

    it('should return the brand-model options', () => {
      expect(response).toEqual([{
        brand: 'brand1',
        model: 'model1'
      }, {
        brand: 'brand2',
        model: 'model2'
      }]);
    });
  });

  describe('getModels', () => {
    let response: Model[];
    const CATEGORY = 1;
    const OBJECT_TYPE_ID = 2;
    const SUGGESTION = 'suggestion';
    const BRAND = 'suggestion';

    beforeEach(fakeAsync(() => {
      const MODELS: Model[] = [{
        model: 'model1'
      }, {
        model: 'model2'
      }];
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(MODELS) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getModels(SUGGESTION, CATEGORY, BRAND, OBJECT_TYPE_ID).subscribe((r: Model[]) => {
        response = r;
      });
    }));

    it('should call the model endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(`${service['API_URL']}/model`,
        { text: SUGGESTION, category_id: CATEGORY, brand: BRAND, object_type_id: OBJECT_TYPE_ID });
    });

    it('should return the model options', () => {
      expect(response).toEqual([{ model: 'model1' }, { model: 'model2' }]);
    });
  });

  describe('getBrands', () => {
    let response: Brand[];
    const CATEGORY = 1;
    const OBJECT_TYPE_ID = 2;
    const SUGGESTION = 'suggestion';

    beforeEach(fakeAsync(() => {
      const BRANDS: Brand[] = [{
        brand: 'brand1'
      }, {
        brand: 'brand2'
      }];
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(BRANDS) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getBrands(SUGGESTION, CATEGORY, OBJECT_TYPE_ID).subscribe((r: Brand[]) => {
        response = r;
      });
    }));

    it('should call the brand endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(`${service['API_URL']}/brand`,
        { text: SUGGESTION, category_id: CATEGORY, object_type_id: OBJECT_TYPE_ID });
    });

    it('should return the brand options', () => {
      expect(response).toEqual([{ brand: 'brand1' }, { brand: 'brand2' }]);
    });
  });

  describe('getSizes', () => {
    let response: IOption[];
    const OBJECT_TYPE_ID = 2;

    beforeEach(fakeAsync(() => {
      const SIZES = {
        female: [{
          id: 34, text: '35'
        }],
        male: [{
          id: 57, text: '48'
        }]
      };
      const res: ResponseOptions = new ResponseOptions({ body: JSON.stringify(SIZES) });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getSizes(OBJECT_TYPE_ID, 'male').subscribe((r: IOption[]) => {
        response = r;
      });
    }));

    it('should call the size endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(`${service['FASHION_KEYS_URL']}/size`, { object_type_id: OBJECT_TYPE_ID, language: 'en' });
    });

    it('should return the size options', () => {
      expect(response).toEqual([{
        value: '57',
        label: '48'
      }]);
    });
  });

});
