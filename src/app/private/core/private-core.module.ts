import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckUserPermissionsResolver } from './resolvers/check-user-permissions.resolver';

@NgModule({
  declarations: [],
  providers: [CheckUserPermissionsResolver],
  imports: [CommonModule],
})
export class PrivateCoreModule {}
