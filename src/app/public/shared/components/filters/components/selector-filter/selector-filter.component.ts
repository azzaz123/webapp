import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractSelectorFilter } from '../abstract-selector-filter/abstract-selector-filter';
import { FilterOption } from '@public/shared/components/filters/core/interfaces/filter-option.interface';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'tsl-selector-filter',
  templateUrl: './selector-filter.component.html',
  styleUrls: ['./selector-filter.component.scss'],
})
export class SelectorFilterComponent extends AbstractSelectorFilter implements OnInit, OnDestroy {
  public options: FilterOption[] = [];
  private subscriptions = new Subscription();

  public ngOnInit(): void {
    super.ngOnInit();
    const sub = super
      .getOptions()
      .pipe(take(1))
      .subscribe((options) => (this.options = options));
    this.subscriptions.add(sub);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
