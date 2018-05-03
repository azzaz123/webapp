import { Item } from '../../../../core/item/item';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CartPro } from './cart-pro';

export interface CartProItem {
    item: Item;
    fromDate?: NgbDateStruct;
    toDate?: NgbDateStruct;
    formattedFromDate?: string;
    formattedToDate?: string;
    bumpType: string;
}
export interface CartProChange {
    action: 'add' | 'remove' | 'clean';
    cart: CartPro;
    itemId?: String;
    type?: string;
}
