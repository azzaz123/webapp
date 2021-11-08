import { TestBed } from '@angular/core/testing';

import { FilterOptionsApiService } from './filter-options-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { FILTER_OPTIONS_API_ENDPOINTS } from '../configurations/filter-options-api-endpoints';
import { ACCEPT_HEADERS, HEADER_NAMES } from '@public/core/constants/header-constants';

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
        const params = {
          ...defaultParams,
          category_id: '100',
        };

        service.getConditionsByCategoryId(params).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.CONDITION_BY_CATEGORY_ID('100'), defaultParams);
      });
    });

    describe('for getting object type options by category id', () => {
      it('should retrieve options', () => {
        const params = {
          ...defaultParams,
          category_id: '100',
        };

        service.getObjectTypesByCategoryId(params).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE, params);

        const parentIdParams = {
          ...defaultParams,
          parent_id: '1200',
          category_id: '100',
        };

        service.getObjectTypesByCategoryId(parentIdParams).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE, parentIdParams);
      });
    });

    describe('for getting object type options with children by category id', () => {
      it('should retrieve options', () => {
        const params = {
          ...defaultParams,
          category_id: '100',
        };
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append(HEADER_NAMES.ACCEPT, ACCEPT_HEADERS.SUGGESTERS_V3);

        service.getObjectTypesByCategoryIdWithChildren(params).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE, params, headers);

        const parentIdParams = {
          ...defaultParams,
          parent_id: '1200',
          category_id: '100',
        };

        service.getObjectTypesByCategoryIdWithChildren(parentIdParams).subscribe();

        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.OBJECT_TYPE, parentIdParams, headers);
      });
    });

    describe('for getting brand model options by categoryId', () => {
      it('should retrieve options', () => {
        const params = {
          ...defaultParams,
          category_id: '100',
        };

        service.getBrandModelByCategoryId(params).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.BRAND_MODEL, params);
      });
    });
  });

  describe('when we need car options', () => {
    describe('for getting brand and model options', () => {
      it('should retrieve options', () => {
        service.getCarBrandsAndModels(defaultParams).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.CARS.BRAND_MODEL, defaultParams);
      });
    });

    describe('for getting body options', () => {
      it('should retrieve options', () => {
        service.getCarBodyTypeKeys(defaultParams).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.CARS.BODY, defaultParams);
      });
    });

    describe('for getting engine options', () => {
      it('should retrieve options', () => {
        service.getCarEngineKeys(defaultParams).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.CARS.ENGINE, defaultParams);
      });
    });

    describe('for getting gearbox options', () => {
      it('should retrieve options', () => {
        service.getCarGearboxKeys(defaultParams).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.CARS.GEARBOX, defaultParams);
      });
    });
  });

  describe('when we need real estate options', () => {
    describe('for getting condition options', () => {
      it('should retrieve options', () => {
        service.getRealEstateConditions(defaultParams).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.CONDITIONS, defaultParams);
      });
    });
    describe('for getting operation options', () => {
      it('should retrieve options', () => {
        service.getRealEstateOperationKeys(defaultParams).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.OPERATION, defaultParams);
      });
    });

    describe('for getting real estate type options by option id', () => {
      it('should retrieve options', () => {
        const params = {
          ...defaultParams,
          operation: 'operation_id',
        };
        service.getRealEstateTypeKeysByOperationId(params).subscribe();

        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.TYPE, params);
      });
    });

    describe('for getting extra options by real state type id', () => {
      it('should retrieve options', () => {
        const params = {
          ...defaultParams,
          type: 'type_id',
        };
        service.getRealEstateExtraKeysByTypeId(params).subscribe();

        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.REAL_ESTATE.EXTRA, params);
      });
    });
  });

  describe('when we need fashion options', () => {
    describe('for getting size options by object type id', () => {
      it('should retrieve options', () => {
        const params = {
          ...defaultParams,
          object_type_id: '100',
        };

        service.getFashionSizeKeysByObjectId(params).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.FASHION.SIZE, params);
      });
    });

    describe('for getting brand options by object type id', () => {
      it('should retrieve options', () => {
        const params = {
          ...defaultParams,
          object_type_id: '100',
        };
        service.getFashionBrandsByObjectTypeId(params).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.FASHION.BRAND, {
          ...params,
          start: '0',
        });

        service.getFashionBrandsByObjectTypeId(params, { offset: 100 }).subscribe();
        expectGetHttpQuery(FILTER_OPTIONS_API_ENDPOINTS.FASHION.BRAND, {
          ...params,
          start: '100',
        });
      });
    });
  });

  function expectGetHttpQuery(path: string, params?: Record<string, string>, headers?: HttpHeaders): void {
    const testParams = new HttpParams({
      fromObject: params,
    });

    const acceptHeader = (headers !== (null || undefined) ? headers : new HttpHeaders()).get(HEADER_NAMES.ACCEPT);

    const url = `${environment.baseUrl}api/v3${path}`;
    const urlWithParams = testParams ? url.concat('?', testParams.toString()) : url;
    const req = httpMock.expectOne(`${urlWithParams}`);
    req.flush({}, { headers: headers });

    expect(req.request.url).toEqual(url);
    expect(req.request.method).toEqual('GET');
    expect(req.request.headers.get(HEADER_NAMES.ACCEPT)).toEqual(acceptHeader);

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
