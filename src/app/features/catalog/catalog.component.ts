import { Component, OnInit } from '@angular/core';
import { TrackingService } from '@core/tracking/tracking.service';
import { UserService } from '@core/user/user.service';

@Component({
  selector: 'tsl-catalog',
  template: ` <router-outlet></router-outlet> `,
})
export class CatalogComponent implements OnInit {
  constructor(
    private trackingService: TrackingService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.me().subscribe(() => {
      this.trackingService.track(TrackingService.CATALOG_VIEW_ITEMS);
    });
  }
}
