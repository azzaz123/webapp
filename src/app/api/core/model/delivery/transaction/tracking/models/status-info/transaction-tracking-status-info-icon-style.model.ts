import { TransactionTrackingIconStyleDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-status-info-dto.interface';
import { TransactionTrackingStyle } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingStatusInfoIconStyleModel implements TransactionTrackingStyle {
  className: string;

  constructor(styleDto: TransactionTrackingIconStyleDto) {
    this.className = this.generateClassName(styleDto);
  }

  private generateClassName(styleDto: TransactionTrackingIconStyleDto): string {
    return styleDto !== 'none' ? styleDto : null;
  }
}
