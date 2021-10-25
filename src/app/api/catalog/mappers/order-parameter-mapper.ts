import { SORT_BY } from '@api/core/model';
import { WALL_SORT_BY } from '../dtos';

export function mapOrderParameter(orderParameter: WALL_SORT_BY): SORT_BY {
  let order: SORT_BY;

  Object.entries(WALL_SORT_BY).forEach(([key, value]) => {
    if (orderParameter === value) {
      order = SORT_BY[key];
    }
  });

  return order || null;
}
