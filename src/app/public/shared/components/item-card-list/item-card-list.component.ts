import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Inject, Input, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureflagService } from '@core/user/featureflag.service';
import { environment } from '@environments/environment';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { CARD_TYPES } from './enums/card-types.enum';
import { ClickedItemCard } from './interfaces/clicked-item-card.interface';
import { ColumnsConfig } from './interfaces/cols-config.interface';
import { SlotsConfig } from './interfaces/slots-config.interface';

@Component({
  selector: 'tsl-public-item-card-list',
  templateUrl: './item-card-list.component.html',
  styleUrls: ['./item-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemCardListComponent {
  @Input() items: ItemCard[];
  @Input() showDescription = true;
  @Input() showPlaceholder = false;
  @Input() placeholderCards = ItemCardListComponent.DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS;
  @Input() columnsConfig: ColumnsConfig = {
    xl: 5,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
  };
  @Input() cardType: CARD_TYPES = CARD_TYPES.REGULAR;
  @Input() slotsConfig: SlotsConfig;
  @Input() isLoading: boolean;
  @Output() clickedItemAndIndex: EventEmitter<ClickedItemCard> = new EventEmitter<ClickedItemCard>();
  @Output() toggleFavouriteEvent: EventEmitter<ItemCard> = new EventEmitter<ItemCard>();

  @ContentChild('slotTemplate') slotTemplate: TemplateRef<unknown>;
  @ContentChild('inlineSlotTemplate') inlineSlotTemplate: TemplateRef<unknown>;

  public cardTypes = CARD_TYPES;
  public readonly INLINE_SLOT_POSITION = 6;
  private static DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS = 15;

  constructor(
    private itemCardService: ItemCardService,
    private checkSessionService: CheckSessionService,
    private featureFlagService: FeatureflagService,
    private router: Router,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  public toggleFavourite(item: ItemCard): void {
    if (this.checkSessionService.hasSession()) {
      this.itemCardService.toggleFavourite(item);
      this.toggleFavouriteEvent.emit(item);
    } else {
      this.checkSessionService.checkSessionAction();
    }
  }

  public openItemDetailPage({ itemCard, index }: ClickedItemCard): void {
    this.clickedItemAndIndex.emit({ itemCard, index });
    const link = environment.siteUrl.replace('es', this.subdomain) + 'item/' + itemCard.webSlug;
    const isExperimentalFeaturesEnabled = this.featureFlagService.isExperimentalFeaturesEnabled();

    //TODO: This can be removed after tests
    if (isExperimentalFeaturesEnabled) {
      this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${itemCard.id}`]);
    } else {
      window.open(link);
    }
  }
}
