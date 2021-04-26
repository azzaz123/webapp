import { TestBed } from '@angular/core/testing';
import { FilterValuesPipe } from './filter-values.pipe';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { FilterConfig } from '../../../interfaces/filter-config.interface';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FILTER_TYPES } from '@public/shared/components/filters/core/enums/filter-types/filter-types.enum';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

describe('IsComplexIconPipe', () => {
  const pipe: FilterValuesPipe = new FilterValuesPipe();

  const values: FilterParameter[] = [
    {
      key: FILTER_QUERY_PARAM_KEY.warranty,
      value: 'value1',
    },
    {
      key: FILTER_QUERY_PARAM_KEY.professional,
      value: 'value2',
    },
  ];
  const config: FilterConfig<unknown> = {
    id: COMMON_CONFIGURATION_ID.PRICE,
    mapKey: {
      param: FILTER_QUERY_PARAM_KEY.warranty,
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
