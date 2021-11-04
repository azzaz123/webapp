import { TransactionTrackingActionStyleDto } from '@api/bff/delivery/transaction-tracking/dtos/responses/types/transaction-tracking-action-style-dto.type';
import { TransactionTrackingStyle } from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingActionStyleModel implements TransactionTrackingStyle {
  className: string;

  constructor(styleDto: TransactionTrackingActionStyleDto) {
    this.className = this.generateClassName(styleDto);
  }

  private generateClassName(styleDto: TransactionTrackingActionStyleDto): string {
    const cssClasses: Record<TransactionTrackingActionStyleDto, string> = {
      text: 'link',
      contained: 'primary',
      outlined: 'secondary',
    };

    return `btn btn-${cssClasses[styleDto]}`;
  }
}
