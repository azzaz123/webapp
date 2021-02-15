import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractFilter } from '../abstract-filter/abstract-filter';

@Component({
  selector: 'tsl-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent extends AbstractFilter {
  constructor() {
    super();
    this.config = { id: '', title: '' };
  }
  public getLabel(): string {
    throw new Error('Method not implemented.');
  }
}
