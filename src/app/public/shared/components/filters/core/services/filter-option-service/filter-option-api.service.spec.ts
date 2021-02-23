import { TestBed } from '@angular/core/testing';

import { FilterOptionsApiService } from './filter-options-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { HttpParams } from '@angular/common/http';
import { FilterOptionApiEndpoints } from './filter-option-api-endpoints';

describe('FilterOptionsApiService', () => {
  let service: FilterOptionsApiService;
  let httpMock: HttpTestingController;

  const defaultParams = {
    language: 'en_EN',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FilterOptionsApiService],
    });
    service = TestBed.inject(FilterOptionsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we need common options', () => {
    describe('for getting condition options by category id', () => {
      it('should retrieve options', () => {
        service.getConditionsByCategoryId(100, defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.condition('100'), defaultParams);
      });
    });

    describe('for getting object type options by category id', () => {
      it('should retrieve options', () => {
        service.getObjectTypesByCategoryId(100, defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.objectType, {
          ...defaultParams,
          category_id: '100',
        });
      });
    });

    describe('for getting object type options by object type parent id', () => {
      it('should retrieve options', () => {
        service.getObjectTypesByParentId(1200, defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.objectType, {
          ...defaultParams,
          parent_id: '1200',
        });
      });
    });

    describe('for getting brand model options by categoryId', () => {
      it('should retrieve options', () => {
        service.getBrandModelByCategoryId(100, defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.brandModel, {
          ...defaultParams,
          category_id: '100',
        });
      });
    });
  });

  describe('when we need car options', () => {
    describe('for getting brand and model options', () => {
      it('should retrieve options', () => {
        service.getCarBrandsAndModels(defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.cars.brandModel, defaultParams);
      });
    });

    describe('for getting body options', () => {
      it('should retrieve options', () => {
        service.getCarBodyTypeKeys(defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.cars.body, defaultParams);
      });
    });

    describe('for getting engine options', () => {
      it('should retrieve options', () => {
        service.getCarEngineKeys(defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.cars.engine, defaultParams);
      });
    });

    describe('for getting gearbox options', () => {
      it('should retrieve options', () => {
        service.getCarGearboxKeys(defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.cars.gearbox, defaultParams);
      });
    });
  });

  describe('when we need real estate options', () => {
    describe('for getting operation options', () => {
      it('should retrieve options', () => {
        service.getRealEstateOperationKeys(defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.realEstate.operation, defaultParams);
      });
    });

    describe('for getting real estate type options by option id', () => {
      it('should retrieve options', () => {
        service.getRealEstateTypeKeysByOperationId('operation_id', defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.realEstate.type, {
          ...defaultParams,
          operation: 'operation_id',
        });
      });
    });

    describe('for getting extra options by real state type id', () => {
      it('should retrieve options', () => {
        service.getRealEstateExtraKeysByTypeId('type_id', defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.realEstate.extra, {
          ...defaultParams,
          type: 'type_id',
        });
      });
    });
  });

  describe('when we need fashion options', () => {
    describe('for getting size options by object type id', () => {
      it('should retrieve options', () => {
        service.getFashionSizeKeysByObjectId(100, defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.fashion.size, {
          ...defaultParams,
          object_type_id: '100',
        });
      });
    });

    describe('for getting brand options by object type id', () => {
      it('should retrieve options', () => {
        service.getFashionBrandsByObjectTypeId(100, defaultParams).subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.fashion.brand, {
          ...defaultParams,
          object_type_id: '100',
          start: '0',
        });

        service
          .getFashionBrandsByObjectTypeId(100, defaultParams, {
            offset: 100,
          })
          .subscribe();
        expectGetHttpQuery(FilterOptionApiEndpoints.fashion.brand, {
          ...defaultParams,
          object_type_id: '100',
          start: '100',
        });
      });
    });
  });

  function expectGetHttpQuery(path: string, params?: Record<string, string>): void {
    const testParams = new HttpParams({
      fromObject: params,
    });
    const url = `${environment.baseUrl}api/v3${path}`;
    const urlWithParams = testParams ? url.concat('?', testParams.toString()) : url;
    const req = httpMock.expectOne(`${urlWithParams}`);
    req.flush({});

    expect(req.request.url).toEqual(url);
    expect(req.request.method).toEqual('GET');

    const reqParams = req.request.params;

    if (testParams) {
      const testKeys = testParams.keys();

      expect(reqParams.keys()).toEqual(testKeys);

      for (const key of testKeys) {
        const values = testParams.getAll(key);

        expect(reqParams.getAll(key)).toEqual(values);
      }
    } else {
      expect(reqParams.keys().length).toBe(0);
    }
  }
});
