import { Component, Input } from '@angular/core';
import { CARD_TYPES } from '../item-card-list/enums/card-types.enum';

@Component({
  selector: 'tsl-item-card-placeholder',
  templateUrl: './item-card-placeholder.component.html',
  styleUrls: ['./item-card-placeholder.component.scss'],
})
export class ItemCardPlaceholderComponent {
  @Input() showDescription: boolean = true;
  @Input() cardType: CARD_TYPES;

  public cardTypes = CARD_TYPES;
}
