import { Purchases, Purchase } from './purchase.interface';

export class PurchasesModel implements Purchases {
  bumpItems: Purchase[];
  nationalBumpItems: Purchase[];
}
