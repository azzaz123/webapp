import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FilterOptionService } from './filter-option.service';
import { FilterOption } from '../../components/filters/core/interfaces/filter-option.interface';
import { FilterOptionsApiService } from './services/filter-options-api.service';
import { FilterOptionsMapperService } from './services/filter-options-mapper.service';
import { ConfigurationId } from '../../components/filters/core/types/configuration-id.type';
import {
  MockFilterOptionApiService,
  MockFilterOptionMapperService,
  MockFilterParameterDraftService,
} from '@fixtures/filter-option.fixtures';
import { FilterParameterStoreService } from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';

jest.mock('./data/hardcoded-options', () => ({
  HARDCODED_OPTIONS: {
    hardcoded: [
      {
        value: 'value',
        label: 'label',
        icon: 'icon.png',
        hasChildren: false,
      },
    ],
  },
}));
jest.mock('./configurations/options-origin-configuration.ts', () => ({
  OPTIONS_ORIGIN_CONFIGURATION: {
    hardcoded: 'hardcoded',
    pureApi: {
      apiConfiguration: {
        method: 'apiMethod',
      },
    },
    apiWithRelatedParams: {
      apiConfiguration: {
        method: 'apiMethod',
        requiredSiblingParams: ['siblingParam1', 'siblingParam2'],
        keyMappers: [
          {
            sourceParamKey: 'siblingParam1',
            destinationParamKey: 'mappedSiblingParam1',
          },
        ],
      },
    },
    mapper: {
      apiConfiguration: {
        method: 'apiMethod',
      },
      mapperConfiguration: {
        method: 'mapperMethod',
      },
    },
    mapperWithRelatedParam: {
      apiConfiguration: {
        method: 'apiMethod',
      },
      mapperConfiguration: {
        method: 'mapperMethod',
        requiredSiblingParams: ['siblingParam1', 'siblingParam2'],
        keyMappers: [
          {
            sourceParamKey: 'siblingParam2',
            destinationParamKey: 'mappedSiblingParam2',
          },
        ],
      },
    },
  },
}));

describe('FilterOptionService', () => {
  let service: FilterOptionService;
  let filterOptionsApiService: MockFilterOptionApiService;
  let filterOptionsMapperService: MockFilterOptionMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterOptionService,
        {
          provide: FilterParameterStoreService,
          useClass: MockFilterParameterDraftService,
        },
        {
          provide: FilterOptionsApiService,
          useClass: MockFilterOptionApiService,
        },
        {
          provide: FilterOptionsMapperService,
          useClass: MockFilterOptionMapperService,
        },
      ],
    });
    service = TestBed.inject(FilterOptionService);
    filterOptionsApiService = (TestBed.inject(FilterOptionsApiService) as unknown) as MockFilterOptionApiService;
    filterOptionsMapperService = (TestBed.inject(FilterOptionsMapperService) as unknown) as MockFilterOptionMapperService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for hardcoded options', () => {
    it('should retrieve corresponding options', fakeAsync(() => {
      let options: FilterOption[];

      service.getOptions('hardcoded' as ConfigurationId).subscribe((opts) => (options = opts));
      tick();

      expect(options).toEqual([
        {
          value: 'value',
          label: 'label',
          icon: 'icon.png',
          hasChildren: false,
        },
      ]);
    }));
  });

  describe('when asked for backend options', () => {
    it('with only the id', fakeAsync(() => {
      spyOn(filterOptionsApiService, 'apiMethod').and.callThrough();

      service.getOptions('pureApi' as ConfigurationId).subscribe();
      tick();

      expect(filterOptionsApiService.apiMethod).toHaveBeenCalledWith({}, { offset: 0 });
    }));

    it('with params', fakeAsync(() => {
      spyOn(filterOptionsApiService, 'apiMethod').and.callThrough();

      service.getOptions('pureApi' as ConfigurationId, { myParam: 'param' }).subscribe();
      tick();

      expect(filterOptionsApiService.apiMethod).toHaveBeenCalledWith({ myParam: 'param' }, { offset: 0 });
    }));

    it('with pagination options', fakeAsync(() => {
      spyOn(filterOptionsApiService, 'apiMethod').and.callThrough();

      service.getOptions('pureApi' as ConfigurationId, undefined, { offset: 10 }).subscribe();
      tick();

      expect(filterOptionsApiService.apiMethod).toHaveBeenCalledWith({}, { offset: 10 });
    }));

    describe('in relation with retrieved format...', () => {
      describe('retrieved options are in the correct format (no mapper method)', () => {
        it('should retrieve corresponding options without calling mapper', fakeAsync(() => {
          spyOn(filterOptionsApiService, 'apiMethod').and.callThrough();
          spyOn(filterOptionsMapperService, 'mapperMethod');

          service.getOptions('pureApi' as ConfigurationId).subscribe();
          tick();

          expect(filterOptionsApiService.apiMethod).toHaveBeenCalledWith({}, { offset: 0 });
          expect(filterOptionsMapperService.mapperMethod).not.toHaveBeenCalled();
        }));
      });

      describe('retrieved options are in an incorrect format (mapper method)', () => {
        it('should retrieve corresponding options and map them', fakeAsync(() => {
          spyOn(filterOptionsApiService, 'apiMethod').and.callThrough();
          spyOn(filterOptionsMapperService, 'mapperMethod');

          service.getOptions('mapper' as ConfigurationId).subscribe();
          tick();

          expect(filterOptionsApiService.apiMethod).toHaveBeenCalledWith({}, { offset: 0 });
          expect(filterOptionsMapperService.mapperMethod).toHaveBeenCalledWith({}, {});
        }));
      });
    });

    describe('in relation with other filters...', () => {
      describe('and endpoint needs info from other filters', () => {
        it('should pass the given keys', fakeAsync(() => {
          spyOn(filterOptionsApiService, 'apiMethod').and.callThrough();

          service.getOptions('apiWithRelatedParams' as ConfigurationId).subscribe();
          tick();

          expect(filterOptionsApiService.apiMethod).toHaveBeenCalledWith(
            {
              mappedSiblingParam1: 'siblingParam1',
              siblingParam2: 'siblingParam2',
            },
            { offset: 0 }
          );
        }));
      });

      describe('and mapper needs info from other filters', () => {
        it('should pass the given keys', fakeAsync(() => {
          spyOn(filterOptionsMapperService, 'mapperMethod');

          service.getOptions('mapperWithRelatedParam' as ConfigurationId).subscribe();
          tick();

          expect(filterOptionsMapperService.mapperMethod).toHaveBeenCalledWith(
            {},
            {
              siblingParam1: 'siblingParam1',
              mappedSiblingParam2: 'siblingParam2',
            }
          );
        }));
      });
    });
  });
});
