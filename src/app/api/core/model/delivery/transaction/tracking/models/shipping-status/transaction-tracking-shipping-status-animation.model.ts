import {
  TransactionTrackingAnimationDto,
  TransactionTrackingAnimationModeDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses/interfaces/transaction-tracking-shipping-status-dto.interface';
import { TransactionTrackingAnimation } from '../../interfaces/transaction-tracking-animation.interface';

export class TransactionTrackingShippingStatusAnimationModel implements TransactionTrackingAnimation {
  isLoop: boolean;
  isLoopReverse: boolean;
  isNormal: boolean;
  url: string;

  constructor(private animation: TransactionTrackingAnimationDto) {
    this.isLoop = this.isType('loop');
    this.isLoopReverse = this.isType('loop_reverse');
    this.isNormal = this.isType('normal');
    this.url = animation.url;
  }

  private isType(expected: TransactionTrackingAnimationModeDto): boolean {
    return this.animation.mode === expected;
  }
}
