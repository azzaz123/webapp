import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ItemExtendedFlags } from '@core/item/item-response.interface';
import { BUMP_FLAGS, ITEM_FLAG_TYPES, LEFT_FLAGS } from '../item-flag/item-flag-constants';

export enum FLAG_POSITION {
  LEFT,
  RIGHT,
}
@Component({
  selector: 'tsl-item-images-carousel',
  templateUrl: './item-images-carousel.component.html',
  styleUrls: ['./item-images-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemImagesCarouselComponent {
  public readonly FLAG_POSITION = FLAG_POSITION;
  public readonly ITEM_FLAG_TYPES = ITEM_FLAG_TYPES;
  @Input() images: string[];
  @Input() itemFlags: ItemExtendedFlags;

  public flagType(flagPosition: FLAG_POSITION): ITEM_FLAG_TYPES {
    const FLAGS = flagPosition === FLAG_POSITION.LEFT ? LEFT_FLAGS : BUMP_FLAGS;

    if (this.itemFlags) {
      const flagStatus = Object.keys(this.itemFlags).find((itemStatus: string) => {
        if (FLAGS.some((flag) => flag.id === itemStatus) && this.itemFlags[itemStatus]) {
          return itemStatus;
        }
      });

      return this.isCountryBumped(flagPosition)
        ? this.isCountryBumped(flagPosition)
        : FLAGS.find((flag) => flag.id === flagStatus)?.itemType;
    }
  }

  private isCountryBumped(flagPosition: FLAG_POSITION): ITEM_FLAG_TYPES {
    if (this.itemFlags.country_bumped && this.itemFlags.bumped && flagPosition === FLAG_POSITION.RIGHT) {
      return ITEM_FLAG_TYPES.COUNTRY_BUMP;
    }
  }
}
