import { TestBed } from '@angular/core/testing';

import { FilterOptionsMapperService } from './filter-options-mapper.service';
import {
  brandNModel,
  commonFashionBrand,
  commonFormattedFashionBrand,
  conditionOption,
  formattedCarBrandNModel,
  formattedConditionOption,
  formattedFemaleSize,
  formattedIconOption,
  formattedMaleSize,
  formattedObjectType,
  formattedPhoneBrandNModel,
  iconOption,
  objectType,
  popularFashionBrand,
  popularFormattedFashionBrand,
  sizeNGender,
} from '@fixtures/filter-option.fixtures';
import { SIZE_GENDER } from '../../../components/filters/core/enums/size-gender.enum';
import { FASHION_BRAND_FILTER_OPTION_GROUP_ID } from '@public/shared/components/filters/core/enums/filter-option-group-ids/fashion/fashion-brand-filter-option-group-id';

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
        conditions: [conditionOption],
      });

      expect(formattedOptions).toEqual([formattedConditionOption]);
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
      const formattedMaleOptions = service.formatSizeNGender(sizeNGender, {
        gender: SIZE_GENDER.MALE,
      });
      const formattedFemaleOptions = service.formatSizeNGender(sizeNGender, {
        gender: SIZE_GENDER.FEMALE,
      });

      expect(formattedMaleOptions).toEqual([formattedMaleSize]);
      expect(formattedFemaleOptions).toEqual([formattedFemaleSize]);
    });
  });

  describe('when formatting fashion brands', () => {
    describe('and has popular brands', () => {
      it('should return FilterOption format with group ids', () => {
        const brands = [commonFashionBrand, popularFashionBrand];

        const formattedOptions = service.formatFashionBrand(brands);

        expect(formattedOptions).toEqual([
          { ...popularFormattedFashionBrand, groupId: FASHION_BRAND_FILTER_OPTION_GROUP_ID.POPULAR },
          { ...commonFormattedFashionBrand, groupId: FASHION_BRAND_FILTER_OPTION_GROUP_ID.COMMON },
        ]);
      });
    });

    describe('and has NO popular brands', () => {
      it('should return FilterOption format without group ids', () => {
        const brands = [commonFashionBrand];

        const formattedOptions = service.formatFashionBrand(brands);

        expect(formattedOptions).toEqual([commonFormattedFashionBrand]);
      });
    });
  });
});
