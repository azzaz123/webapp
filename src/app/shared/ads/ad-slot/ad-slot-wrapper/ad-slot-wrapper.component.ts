import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { AdSlotComponent } from '@shared/ads/ad-slot/ad-slot.component';

@Component({
  selector: 'tsl-sky-wrapper',
  templateUrl: './ad-slot-wrapper.component.html',
  styleUrls: ['./ad-slot-wrapper.component.scss'],
})
export class AdSlotWrapperComponent implements AfterContentInit {
  @ContentChildren(AdSlotComponent, { descendants: true }) slotsQuery!: QueryList<AdSlotComponent>;

  constructor(private adsService: AdsService) {}

  public ngAfterContentInit(): void {
    console.log('AdSlotWrapperComponent.ngAfterContentInit - Slots', this.slotsQuery);
  }
}
