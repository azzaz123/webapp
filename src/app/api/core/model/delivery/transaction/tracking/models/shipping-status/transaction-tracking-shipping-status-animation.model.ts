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

  constructor(animation: TransactionTrackingAnimationDto) {
    this.isLoop = this.isType(animation, 'loop');
    this.isLoopReverse = this.isType(animation, 'loop_reverse');
    this.isNormal = this.isType(animation, 'normal');
    this.url = animation.url;
  }

  private isType(animation: TransactionTrackingAnimationDto, expected: TransactionTrackingAnimationModeDto): boolean {
    return animation.mode === expected;
  }
}
