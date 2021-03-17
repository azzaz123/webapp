import { TestBed } from '@angular/core/testing';

import { FilterParameterDraftService } from './filter-parameter-draft.service';
import { filterParameters } from '@fixtures/filter-parameter.fixtures';
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
      service.setParameters(filterParameters);
    });
    it('should return all parameters', () => {
      expect(service.getParameters()).toEqual(filterParameters);
    });
  });

  describe('when asked for a subset of parameters by their key', () => {
    const filterKey = filterParameters.map((parameter) => parameter.key)[0];
    beforeEach(() => {
      service.setParameters(filterParameters);
    });
    it('should return the corresponding parameters', () => {
      expect(service.getParametersByKey([filterKey])).toEqual([filterParameters[0]]);
    });
  });

  describe('when we have a new set of parameters', () => {
    it('should overwrite the current parameters', () => {
      expect(service.getParameters()).toEqual([]);

      service.setParameters(filterParameters);

      expect(service.getParameters()).toEqual(filterParameters);
    });
  });

  describe('when we need to upsert parameters', () => {
    beforeEach(() => {
      service.setParameters(filterParameters);
    });
    describe('and the parameters do not exist', () => {
      it('should add them to the parameter set', () => {
        const newParameter: FilterParameter = {
          key: 'newParameterKey',
          value: 'newParameterValue',
        };

        service.upsertParameters([newParameter]);

        expect(service.getParameters()).toEqual([newParameter, ...filterParameters]);
      });
    });
    describe('and the parameters do exist', () => {
      it('should overwrite the parameter values', () => {
        const newParameter: FilterParameter = {
          key: 'filterParameter1',
          value: 'newParameterValue',
        };

        service.upsertParameters([newParameter]);

        expect(service.getParameters()).toEqual([newParameter, filterParameters[1]]);
      });
    });
  });
});
