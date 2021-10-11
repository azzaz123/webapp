import { Injectable } from '@angular/core';

import { Money } from '@api/core/model/money.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { WalletTransferRequest } from '@private/features/wallet/interfaces/transfer/wallet-transfer-request.interface';

@Injectable()
export class WalletTransferMapperService {
  constructor(private uuidService: UuidService) {}

  public mapToRequest(money: Money): WalletTransferRequest {
    return {
      id: this.uuidService.getUUID(),
      pay_out_id: this.uuidService.getUUID(),
      funds: {
        amount: money.amount.total,
        currency: money.currency.code,
      },
    };
  }
}
