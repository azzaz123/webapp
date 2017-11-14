import { Component, OnInit } from '@angular/core';
import { TrackingService } from 'shield';

@Component({
  selector: 'tsl-catalog',
  template: `
    <router-outlet></router-outlet>
  `
})
export class CatalogComponent implements OnInit {

  constructor(private trackingService: TrackingService) {
  }

  ngOnInit() {
    this.trackingService.track(TrackingService.CATALOG_VIEW_ITEMS);
  }

}
