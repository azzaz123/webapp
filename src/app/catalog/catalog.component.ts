import { Component, OnInit } from '@angular/core';
import { TrackingService, UserService} from 'shield';

@Component({
  selector: 'tsl-catalog',
  template: `
    <router-outlet></router-outlet>
  `
})
export class CatalogComponent implements OnInit {

  constructor(private trackingService: TrackingService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.me().subscribe(
      () => {
        this.trackingService.track(TrackingService.CATALOG_VIEW_ITEMS);
      });
  }

}
