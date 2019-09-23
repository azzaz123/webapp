import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteConsoleService } from './remote-console.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FeatureflagService } from '../user/featureflag.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    RemoteConsoleService,
    DeviceDetectorService,
    FeatureflagService
  ]
})
export class RemoteConsoleModule {
}
