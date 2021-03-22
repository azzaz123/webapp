import { TestBed } from '@angular/core/testing';

import { FilterParameterDraftService } from './filter-parameter-draft.service';
import { filterParametersMock } from '@fixtures/filter-parameter.fixtures';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

describe('FilterParameterDraftService', () => {
  let service: FilterParameterDraftService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterParameterDraftService],
    });
    service = TestBed.inject(FilterParameterDraftService);
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
    });
  });
});
