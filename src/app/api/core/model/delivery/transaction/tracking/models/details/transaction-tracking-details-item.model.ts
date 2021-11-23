import { mapNumberAndCurrencyCodeToMoney, NumberCurrencyCode } from '@api/core/mappers';
import { Money } from '@api/core/model/money.interface';
import {
  TransactionTrackingDetailsItem,
  TransactionTrackingStatusInfoIcon,
  TransactionTrackingStatusInfoIconModel,
} from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingDetailsItemDto,
  TransactionTrackingDetailsPriceDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingDetailsItemModel implements TransactionTrackingDetailsItem {
  icon: TransactionTrackingStatusInfoIcon;
  price: Money;
  title: string;

  constructor(transactionTrackingDetailsItemDto: TransactionTrackingDetailsItemDto) {
    this.icon = new TransactionTrackingStatusInfoIconModel(transactionTrackingDetailsItemDto.icon);
    this.price = this.getPrice(transactionTrackingDetailsItemDto.price);
    this.title = transactionTrackingDetailsItemDto.title;
  }

  private getPrice(transactionTrackingDetailsPriceDto: TransactionTrackingDetailsPriceDto): Money {
    const numberCurrencyCode: NumberCurrencyCode = {
      number: transactionTrackingDetailsPriceDto.amount,
      currency: transactionTrackingDetailsPriceDto.currency,
    };
    return mapNumberAndCurrencyCodeToMoney(numberCurrencyCode);
  }
}
