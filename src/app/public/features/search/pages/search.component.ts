import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Item } from '@core/item/item';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';

@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public items: Item[];

  constructor() {}

  public ngOnInit() {
    this.items = Array(10).fill(MOCK_ITEM);
  }
}
