import { TestBed } from '@angular/core/testing';

import { FilterOptionsMapperService } from './filter-options-mapper.service';

describe('FilterOptionsMapperService', () => {
  let service: FilterOptionsMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterOptionsMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when formatting conditions', () => {
    it('should return FilterOption format', () => {});
  });

  describe('when formatting object types', () => {
    it('should return FilterOption format', () => {});
  });

  describe('when formatting brand model', () => {
    it('should return FilterOption format', () => {});
  });

  describe('when formatting icon options', () => {
    it('should return FilterOption format', () => {});
  });

  describe('when formatting size and gender', () => {
    it('should return FilterOption format', () => {});
  });

  describe('when formatting fashion brands', () => {
    it('should return FilterOption format', () => {});
  });
});
