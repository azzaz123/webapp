import { WallResponse } from '@api/catalog/dtos';
import { wallItemFixture } from '@api/fixtures/catalog/wall/wall-item.fixtures';

export const wallResponseFixture: WallResponse = {
  data: [wallItemFixture],
  meta: {
    next: 'nextParameter',
    order: 'distance' as any,
  },
};
