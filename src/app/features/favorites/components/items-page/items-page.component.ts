import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '@core/item/item';

@Component({
  selector: 'tsl-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss'],
})
export class ItemsPageComponent implements OnInit {
  public items: Item[];
  public numberOfFavorites: number;

  constructor(private router: Router) {
    const items = this.router.getCurrentNavigation().extras.state;
    this.items = items.data;
  }

  ngOnInit(): void {}

  public onFavoriteChange(item: Item) {
    this.removeItem(item);
  }

  public removeItem(item: Item) {
    if (this.items.length) {
      const index = this.items.indexOf(item);
      this.items.splice(index, 1);
      this.numberOfFavorites--;
    }
  }
}
