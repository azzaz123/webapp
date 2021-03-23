import { TestBed } from '@angular/core/testing';

import { FilterParameterStoreService } from './filter-parameter-store.service';
import { filterParametersMock } from '@fixtures/filter-parameter.fixtures';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

describe('FilterParameterStoreServiceService', () => {
  let service: FilterParameterStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterParameterStoreService],
    });
    service = TestBed.inject(FilterParameterStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for current parameters', () => {
    beforeEach(() => {
      service.setParameters(filterParametersMock);
    });
    it('should return all parameters', () => {
      expect(service.getParameters()).toEqual(filterParametersMock);
    });
  });

  describe('when asked for a subset of parameters by their key', () => {
    const filterKey = filterParametersMock.map((parameter) => parameter.key)[0];
    beforeEach(() => {
      service.setParameters(filterParametersMock);
    });
    it('should return the corresponding parameters', () => {
      expect(service.getParametersByKeys([filterKey])).toEqual([filterParametersMock[0]]);
    });
  });

  describe('when we have a new set of parameters', () => {
    it('should overwrite the current parameters', () => {
      expect(service.getParameters()).toEqual([]);

      service.setParameters(filterParametersMock);

      expect(service.getParameters()).toEqual(filterParametersMock);
    });
    it('should propagate parameters to listeners', () => {
      let parameters: FilterParameter[];
      service.parameters$.subscribe((params) => (parameters = params));

      service.setParameters(filterParametersMock);

      expect(parameters).toEqual(filterParametersMock);
    });
  });

  describe('when we need to upsert parameters', () => {
    beforeEach(() => {
      service.setParameters(filterParametersMock);
    });
    describe('and the parameters do not exist', () => {
      it('should add them to the parameter set', () => {
        const newParameter: FilterParameter = {
          key: 'newParameterKey',
          value: 'newParameterValue',
        };

        service.upsertParameters([newParameter]);

        expect(service.getParameters()).toEqual([newParameter, ...filterParametersMock]);
      });
      it('should propagate parameters to listeners', () => {
        const newParameter: FilterParameter = {
          key: 'newParameterKey',
          value: 'newParameterValue',
        };
        let parameters: FilterParameter[];
        service.parameters$.subscribe((params) => (parameters = params));

        service.upsertParameters([newParameter]);

        expect(parameters).toEqual([newParameter, ...filterParametersMock]);
      });
    });
    describe('and the parameters do exist', () => {
      it('should overwrite the parameter values', () => {
        const newParameter: FilterParameter = {
          key: 'filterParameter1',
          value: 'newParameterValue',
        };

        service.upsertParameters([newParameter]);

        expect(service.getParameters()).toEqual([newParameter, filterParametersMock[1]]);
      });
      it('should propagate parameters to listeners', () => {
        const updatedParameter: FilterParameter = {
          ...filterParametersMock[0],
          value: 'newParameterValue',
        };
        let parameters: FilterParameter[];
        service.parameters$.subscribe((params) => (parameters = params));

        service.upsertParameters([updatedParameter]);

        const expectedParameters = filterParametersMock.map((parameter, index) => (index === 0 ? updatedParameter : parameter));
        expect(parameters).toEqual(expectedParameters);
      });
    });
  });
});
