import { Component, Input } from '@angular/core';
import { CARD_TYPES } from '../../enums/card-types.enum';

@Component({
  selector: '[item-card-list-placeholder]',
  templateUrl: './item-card-list-placeholder.component.html',
  styleUrls: ['./item-card-list-placeholder.component.scss'],
})
export class ItemCardListPlaceholderComponent {
  @Input() numberOfCards: number = ItemCardListPlaceholderComponent.DEFAULT_NUMBER_OF_CARDS;
  @Input() cardType: CARD_TYPES = CARD_TYPES.REGULAR;

  public cardTypes = CARD_TYPES;
  private static DEFAULT_NUMBER_OF_CARDS = 15;
}
