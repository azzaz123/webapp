import { PayviewState } from '../../interfaces/payview-state.interface';
import { ClickAddEditCard } from '@core/analytics/resources/events-interfaces/click-add-edit-card.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { SCREEN_IDS } from '@core/analytics/resources/analytics-screen-ids';
import { ClickAddEditAddress } from '@core/analytics/resources/events-interfaces/click-add-edit-address.interface';

export function getClickAddEditCardEventPropertiesFromPayviewState(payviewState: PayviewState): ClickAddEditCard {
  return {
    screenId: SCREEN_IDS.Checkout,
    addOrEdit: getAddOrEditCard(payviewState.payment.card),
    itemId: payviewState.item.id,
    categoryId: payviewState.item.categoryId,
    itemPrice: payviewState.costs.buyerCost.productPrice.amount.total,
  };
}

// export function getClickAddEditAddressEventPropertiesFromPayviewState(payviewState: PayviewState): ClickAddEditAddress {
//   return {

//   }
// }

function getAddOrEditCard(card: CreditCard): ClickAddEditCard['addOrEdit'] {
  return card ? 'edit' : 'add';
}
