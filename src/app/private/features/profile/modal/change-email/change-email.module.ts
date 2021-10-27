import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ChangeEmailRoutedComponents, ChangeEmailRoutingModule } from './change-email.routing.module';

@NgModule({
  imports: [SharedModule, ChangeEmailRoutingModule],
  declarations: [ChangeEmailRoutedComponents],
  providers: [],
})
export class ChangeEmailModule {}
