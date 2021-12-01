import { NgModule } from '@angular/core';
import { UserProfileRoutePipe } from './user-profile-route.pipe';

@NgModule({
  declarations: [UserProfileRoutePipe],
  exports: [UserProfileRoutePipe],
  providers: [UserProfileRoutePipe],
})
export class UserProfileRouteModule {}
