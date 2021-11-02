import { WallResponse, WALL_SORT_BY } from '@api/catalog/dtos';
import { wallItemFixture } from '@api/fixtures/catalog/wall/wall-item.fixtures';

export const wallResponseFixture: WallResponse = {
  data: [wallItemFixture],
  meta: {
    next: 'nextParameter',
    order: {
      type: WALL_SORT_BY.DISTANCE,
    },
  },
};
