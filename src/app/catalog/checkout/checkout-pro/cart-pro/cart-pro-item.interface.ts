import { Item } from '../../../../core/item/item';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface CartProItem {
    item: Item;
    fromDate?: NgbDateStruct;
    toDate?: NgbDateStruct;
    bumpType: String;
}
