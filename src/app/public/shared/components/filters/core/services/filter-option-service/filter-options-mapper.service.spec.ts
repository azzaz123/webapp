import { TestBed } from '@angular/core/testing';

import { FilterOptionsMapperService } from './filter-options-mapper.service';
import {
  brandNModel,
  fashionBrand,
  formattedCarBrandNModel,
  formattedFashionBrand,
  formattedFemaleSize,
  formattedIconOption,
  formattedMaleSize,
  formattedObjectType,
  formattedPhoneBrandNModel,
  iconOption,
  objectType,
  sizeNGender,
} from './filter-option.fixtures';
import { SIZE_GENDER } from '../../enums/size-gender.enum';

describe('FilterOptionsMapperService', () => {
  let service: FilterOptionsMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilterOptionsMapperService],
    });
    service = TestBed.inject(FilterOptionsMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when formatting conditions', () => {
    it('should return FilterOption format', () => {
      const formattedOptions = service.formatConditionResponse({
        category_id: 'id',
        conditions: [iconOption],
      });

      expect(formattedOptions).toEqual([formattedIconOption]);
    });
  });

  describe('when formatting object types', () => {
    it('should return FilterOption format', () => {
      const formattedOptions = service.formatObjectType([objectType]);

      expect(formattedOptions).toEqual([formattedObjectType]);
    });
  });

  describe('when formatting phones brand model', () => {
    it('should return FilterOption format', () => {
      const formattedOptions = service.formatBrandModel([brandNModel]);

      expect(formattedOptions).toEqual([formattedPhoneBrandNModel]);
    });
  });

  describe('when formatting cars brand model', () => {
    it('should return FilterOption format', () => {
      const formattedOptions = service.formatCarsBrandModel([brandNModel]);

      expect(formattedOptions).toEqual([formattedCarBrandNModel]);
    });
  });

  describe('when formatting icon options', () => {
    it('should return FilterOption format', () => {
      const formattedOptions = service.formatIconOptions([iconOption]);

      expect(formattedOptions).toEqual([formattedIconOption]);
    });
  });

  describe('when formatting size and gender', () => {
    it('should return FilterOption format', () => {
      const formattedMaleOptions = service.formatSizeNGender(sizeNGender, SIZE_GENDER.MALE);
      const formattedFemaleOptions = service.formatSizeNGender(sizeNGender, SIZE_GENDER.FEMALE);

      expect(formattedMaleOptions).toEqual([formattedMaleSize]);
      expect(formattedFemaleOptions).toEqual([formattedFemaleSize]);
    });
  });

  describe('when formatting fashion brands', () => {
    it('should return FilterOption format', () => {
      const formattedOptions = service.formatFashionBrand([fashionBrand]);

      expect(formattedOptions).toEqual([formattedFashionBrand]);
    });
  });
});
