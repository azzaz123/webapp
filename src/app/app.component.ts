import { Component, OnInit } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag-constants';
import { FeatureflagService } from '@core/user/featureflag.service';
import { DEFAULT_PERMISSIONS } from '@core/user/user-constants';
import { NgxPermissionsService } from 'ngx-permissions';
import { take } from 'rxjs/operators';
@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private permissionsService: NgxPermissionsService, private featureFlagService: FeatureflagService) {}

  ngOnInit(): void {
    this.permissionsService.addPermission(DEFAULT_PERMISSIONS);
    this.getFeatureFlags();
  }

  private getFeatureFlags() {
    this.featureFlagService.getFlag(FEATURE_FLAGS_ENUM.VISIBILITY).pipe(take(1)).subscribe();
  }
}
