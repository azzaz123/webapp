import { TestBed } from '@angular/core/testing';

import { FilterOptionAPIServiceService } from './filter-option-apiservice.service';

describe('FilterOptionAPIServiceService', () => {
  let service: FilterOptionAPIServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterOptionAPIServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we need common options', () => {
    describe('for getting condition options by category id', () => {
      it('should retrieve options');
    });

    describe('for getting object type options by category id', () => {
      it('should retrieve options');
    });

    describe('for getting object type options by object type parent id', () => {
      it('should retrieve options');
    });
  });

  describe('when we need car options', () => {
    describe('for getting brand and model options', () => {
      it('should retrieve options');
    });

    describe('for getting body options', () => {
      it('should retrieve options');
    });

    describe('for getting engine options', () => {
      it('should retrieve options');
    });

    describe('for getting gearbox options', () => {
      it('should retrieve options');
    });
  });

  describe('when we need real estate options', () => {
    describe('for getting operation options', () => {
      it('should retrieve options');
    });

    describe('for getting real estate type options by option id', () => {
      it('should retrieve options');
    });

    describe('for getting extra options by real state type id', () => {
      it('should retrieve options');
    });
  });

  describe('when we need fashion options', () => {
    describe('for getting size options by object type id', () => {
      it('should retrieve options');
    });

    describe('for getting brand options by object type id', () => {
      it('should retrieve options');
    });
  });
});
