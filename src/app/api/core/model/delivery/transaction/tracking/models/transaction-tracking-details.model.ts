import {
  TransactionTrackingDetails,
  TransactionTrackingDetailsItem,
  TransactionTrackingDetailsItemModel,
  TransactionTrackingDetailsUser,
  TransactionTrackingDetailsUserModel,
  TransactionTrackingStatusInfo,
  TransactionTrackingStatusInfoModel,
} from '@api/core/model/delivery/transaction/tracking';
import { TransactionTrackingDetailsDto, TransactionTrackingDetailsInfoDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';

export class TransactionTrackingDetailsModel implements TransactionTrackingDetails {
  info: TransactionTrackingStatusInfo[];
  item: TransactionTrackingDetailsItem;
  title: string;
  user: TransactionTrackingDetailsUser;

  constructor(transactionTrackingDetailsDto: TransactionTrackingDetailsDto) {
    this.info = this.getStatusInfos(transactionTrackingDetailsDto.details_info);
    this.item = new TransactionTrackingDetailsItemModel(transactionTrackingDetailsDto.item);
    this.title = transactionTrackingDetailsDto.title;
    this.user = new TransactionTrackingDetailsUserModel(transactionTrackingDetailsDto.user);
  }

  private getStatusInfos(transactionTrackingDetailsInfoDto: TransactionTrackingDetailsInfoDto[]): TransactionTrackingStatusInfo[] {
    let statusInfos: TransactionTrackingStatusInfo[] = [];

    transactionTrackingDetailsInfoDto.forEach((infoDto) => {
      statusInfos.push(new TransactionTrackingStatusInfoModel(infoDto));
    });
    return statusInfos;
  }
}
