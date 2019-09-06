import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteConsoleService } from './remote-console.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    RemoteConsoleService,
    DeviceDetectorService
  ]
})
export class RemoteConsoleModule {
}
