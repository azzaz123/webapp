import { TestBed } from '@angular/core/testing';

import { FilterOptionsApiService } from './filter-options-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { HttpParams } from '@angular/common/http';
import { FilterOptionApiEndpoints } from '@public/shared/components/filters/core/services/filter-option-service/filter-option-api-endpoints.enum';

describe('FilterOptionsApiService', () => {
  let service: FilterOptionsApiService;
  let httpMock: HttpTestingController;

  const defaultParams = {
    language: 'en_EN',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FilterOptionsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when retrieving options', () => {
    describe('and backend returns pagination', () => {
      it('should propagate pagination with the options', () => {});
    });

    describe('and backend returns no pagination', () => {
      it('should not propagate any pagination', () => {});
    });
  });

  describe('when we need common options', () => {
    describe('for getting condition options by category id', () => {
      it('should retrieve options', () => {
        service.getConditionsByCategoryId(100, defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.CONDITION.replace('{category_id}', '100'), defaultParams);
      });
    });

    describe('for getting object type options by category id', () => {
      it('should retrieve options', () => {
        service.getObjectTypesByCategoryId(100, defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.OBJECT_TYPE, {
          category_id: '100',
          ...defaultParams,
        });
      });
    });

    describe('for getting object type options by object type parent id', () => {
      it('should retrieve options', () => {
        service.getObjectTypesByParentId(1200, defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.OBJECT_TYPE, {
          parent_id: '1200',
          ...defaultParams,
        });
      });
    });
  });

  describe('when we need car options', () => {
    describe('for getting brand and model options', () => {
      it('should retrieve options', () => {
        service.getCarBrandsAndModels(defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.CARS_BRAND_MODEL, defaultParams);
      });
    });

    describe('for getting body options', () => {
      it('should retrieve options', () => {
        service.getCarBodyTypeKeys(defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.CARS_BODY, defaultParams);
      });
    });

    describe('for getting engine options', () => {
      it('should retrieve options', () => {
        service.getCarEngineKeys(defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.CARS_ENGINE, defaultParams);
      });
    });

    describe('for getting gearbox options', () => {
      it('should retrieve options', () => {
        service.getCarGearboxKeys(defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.CARS_GEARBOX, defaultParams);
      });
    });
  });

  describe('when we need real estate options', () => {
    describe('for getting operation options', () => {
      it('should retrieve options', () => {
        service.getRealEstateOperationKeys(defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.REAL_ESTATE_OPERATION_TYPE, defaultParams);
      });
    });

    describe('for getting real estate type options by option id', () => {
      it('should retrieve options', () => {
        service.getRealEstateTypeKeysByOperationId('operation_id', defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.REAL_ESTATE_OPERATION_TYPE, {
          operation: 'operation_id',
          ...defaultParams,
        });
      });
    });

    describe('for getting extra options by real state type id', () => {
      it('should retrieve options', () => {
        service.getRealEstateExtraKeysByTypeId('type_id', defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.CARS_GEARBOX, {
          type: 'type_id',
          ...defaultParams,
        });
      });
    });
  });

  describe('when we need fashion options', () => {
    describe('for getting size options by object type id', () => {
      it('should retrieve options', () => {
        service.getFashionSizeKeysByObjectId(100, defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.REAL_ESTATE_OPERATION_TYPE, {
          object_type_id: '100',
          ...defaultParams,
        });
      });
    });

    describe('for getting brand options by object type id', () => {
      it('should retrieve options', () => {
        service.getFashionBrandsByObjectTypeId(100, defaultParams);
        expectGetHttpQuery(FilterOptionApiEndpoints.REAL_ESTATE_OPERATION_TYPE, {
          object_type_id: '100',
          ...defaultParams,
        });

        service.getFashionBrandsByObjectTypeId(100, defaultParams, {
          offset: 100,
        });
        expectGetHttpQuery(FilterOptionApiEndpoints.REAL_ESTATE_OPERATION_TYPE, {
          object_type_id: '100',
          start: '100',
          ...defaultParams,
        });
      });
    });
  });

  function expectGetHttpQuery(path: string, params?: Record<string, string>): void {
    const testParams = new HttpParams({
      fromObject: params,
    });
    const url = `${environment.baseUrl}${path}`;
    const urlWithParams = testParams ? url.concat('?', testParams.toString()) : url;
    const req = httpMock.expectOne(`${urlWithParams}`);
    req.flush([]);

    expect(req.request.url).toEqual(`${environment.baseUrl}api/v3${path}`);
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
