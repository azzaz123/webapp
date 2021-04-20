import { TestBed } from '@angular/core/testing';
import { FilterValuesPipe } from './filter-values.pipe';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';

describe('IsComplexIconPipe', () => {
  const pipe: FilterValuesPipe = new FilterValuesPipe();

  const values: FilterParameter[] = [
    {
      key: 'key1',
      value: 'value1',
    },
    {
      key: 'key2',
      value: 'value2',
    },
  ];
  const config: FilterConfig<unknown> = {
    id: COMMON_CONFIGURATION_ID.PRICE,
    mapKey: {
      param: 'key1',
    },
    title: 'Title',
    bubblePlaceholder: 'placeholder',
    type: FILTER_TYPES.TOGGLE,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterValuesPipe],
    }).compileComponents();
  });

  it('should return only values corresponding with config', () => {
    const filterValue = pipe.transform(values, config);

    expect(filterValue).toEqual([values[0]]);
  });
});
