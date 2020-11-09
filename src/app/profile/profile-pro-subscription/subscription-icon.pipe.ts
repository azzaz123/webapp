import { Pipe, PipeTransform } from '@angular/core';
import { Pack } from '../../core/payments/pack';

@Pipe({
  name: 'subscriptionIcon',
})
export class SubscriptionIconPipe implements PipeTransform {
  transform(bump: Pack, selected?: any): any {
    let iconName =
      '/assets/icons/plans/plan' +
      (bump.quantity <= 200
        ? bump.quantity
        : bump.quantity <= 0
        ? 10
        : 'personal');
    if (selected) {
      iconName += '_selected';
    }
    return iconName + '.svg';
  }
}
