import { HttpParams } from '@angular/common/http';
import { ToApiMapper } from '@api/core/utils/types';

type SellerRequestsParamsInput = { buyerHash: string; itemHash: string };

export const mapBuyerAndItemHashToSellerRequestsParams: ToApiMapper<SellerRequestsParamsInput, HttpParams> = (
  input: SellerRequestsParamsInput
) => {
  const { buyerHash, itemHash } = input;
  return new HttpParams().appendAll({
    buyer_user_hash: buyerHash,
    item_hash: itemHash,
  });
};
