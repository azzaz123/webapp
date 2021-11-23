import { TransactionTrackingDetailsInfoDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-details-info-dto.interface';
import { TransactionTrackingDetailsItemDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-details-dto.interface';
import { TransactionTrackingDetailsUserDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-details-user-dto.interface';

export interface TransactionTrackingDetailsDto {
  item: TransactionTrackingDetailsItemDto;
  user: TransactionTrackingDetailsUserDto;
  title: string;
  details_info: TransactionTrackingDetailsInfoDto[];
}
