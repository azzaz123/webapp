import { BUMP_TYPE } from './bump.interface';

export interface BumpsPackageUse {
  id: string;
  item_id: string;
  type: BUMP_TYPE;
}
