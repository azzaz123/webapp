import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoteConsoleService } from './remote-console.service';
import { RemoteConsoleClientService } from './remote-console-client.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
  providers: [RemoteConsoleService, RemoteConsoleClientService],
})
export class RemoteConsoleModule {}
