import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteConsoleService } from './remote-console.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FeatureflagService } from '../user/featureflag.service';
import { RemoteConsoleClientService } from './remote-console-client.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [
    RemoteConsoleService,
    RemoteConsoleClientService,
    DeviceDetectorService,
    FeatureflagService,
  ],
})
export class RemoteConsoleModule {}
