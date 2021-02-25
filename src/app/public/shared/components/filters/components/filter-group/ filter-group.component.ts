import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tsl-filter-group',
  templateUrl: './filter-group.component.html',
  styleUrls: ['./filter-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterGroup {}
