import { TransactionTrackingDetailsPriceDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-details-price-dto.interface';
import { TransactionTrackingIconDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';

export interface TransactionTrackingDetailsItemDto {
  icon: TransactionTrackingIconDto;
  title: string;
  price: TransactionTrackingDetailsPriceDto;
}
