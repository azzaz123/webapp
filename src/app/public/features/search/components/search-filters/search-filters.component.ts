import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tsl-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersComponent {
  public drawer = {
    isOpen: false,
    offsetTop: 66,
    hasApply: true,
  };

  public activeFiltersCount = 0;

  constructor() {}

  public toggleDrawer(): void {
    this.drawer.isOpen = !this.drawer.isOpen;
  }

  public closeDrawer(): void {
    this.drawer.isOpen = false;
  }
}
