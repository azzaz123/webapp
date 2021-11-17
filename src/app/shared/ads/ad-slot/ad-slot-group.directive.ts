import { AfterContentInit, Directive } from '@angular/core';
import { ContentChildren, QueryList } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { Variant } from '@core/experimentation/models';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { OPTIMIZE_EXPERIMENTS } from '@core/experimentation/vendors/optimize/resources/optimize-experiment-ids';
import { AdSlotComponent } from '@shared/ads/ad-slot/ad-slot.component';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Directive({
  selector: '[tslAdSlotGroup]',
})
export class AdSlotGroupDirective implements AfterContentInit {
  @ContentChildren(AdSlotComponent, { descendants: true }) slotsQuery!: QueryList<AdSlotComponent>;

  constructor(private adsService: AdsService, private experimentationService: ExperimentationService) {}

  public ngAfterContentInit(): void {
    combineLatest([this.experimentationService.experimentReady$, this.slotsQuery.changes.pipe(take(1))])
      .pipe(
        filter(([experimentationReady, components]: [boolean, AdSlotComponent[]]) => experimentationReady),
        map(([_, components]: [boolean, AdSlotComponent[]]) => components)
      )
      .subscribe((components) => {
        const variant: Variant = this.experimentationService.getOptimizeVariant(OPTIMIZE_EXPERIMENTS.SearchPage3rdSlotPosition);
        const configurations: AdSlotConfiguration[] = components.map((component) => component.adSlot);

        const filteredConfigurations: AdSlotConfiguration[] = this.filterOnVariant(variant, configurations);

        this.adsService.setSlots(filteredConfigurations);
      });
  }

  private filterOnVariant(variant: Variant, configurations: AdSlotConfiguration[]): AdSlotConfiguration[] {
    this.setTargetingOnVariant(variant);
    this.adsService.setTargetingByAdsKeywords();

    if (variant === 'Baseline') {
      return configurations.filter((configuration) => !configuration.type.includes('variant'));
    }

    return configurations.filter((configuration) => !configuration.type.includes('baseline'));
  }

  private setTargetingOnVariant(variant: Variant): void {
    variant === 'Baseline'
      ? this.adsService.setAdKeywords({ MwebSearchLayout: 'old' })
      : this.adsService.setAdKeywords({ MwebSearchLayout: 'new' });
  }
}
