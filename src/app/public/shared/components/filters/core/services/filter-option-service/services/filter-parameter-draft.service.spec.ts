import { TestBed } from '@angular/core/testing';

import { FilterParameterDraftService } from './filter-parameter-draft.service';

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
    it('should return all parameters', () => {});
  });

  describe('when asked for a subset of parameters by their key', () => {
    it('should return the corresponding parameters', () => {});
  });

  describe('when we have a new set of parameters', () => {
    it('should overwrite the current parameters', () => {});
    it('should propagate parameters to listeners', () => {});
  });

  describe('when we need to upsert parameters', () => {
    describe('and the parameters do not exist', () => {
      it('should add them to the parameter set', () => {});
      it('should propagate parameters to listeners', () => {});
    });
    describe('and the parameters do exist', () => {
      it('should overwrite the parameter values', () => {});
      it('should propagate parameters to listeners', () => {});
    });
  });
});
