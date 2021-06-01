import { Component, OnInit } from '@angular/core';
import { FEATURE_FLAGS_ENUM } from '@core/user/featureflag.interface';
import { FeatureflagService } from '@core/user/featureflag.service';
import { PERMISSIONS } from '@core/user/user';
import { NgxPermissionsService } from 'ngx-permissions';
@Component({
  selector: 'tsl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private permissionsService: NgxPermissionsService, private featureFlagService: FeatureflagService) {}

  ngOnInit(): void {
    this.permissionsService.addPermission(PERMISSIONS.visibility);
    this.getFeatureFlags();
  }

  private getFeatureFlags() {
    this.featureFlagService.getFlag(FEATURE_FLAGS_ENUM.VISIBILITY).subscribe();
  }
}
