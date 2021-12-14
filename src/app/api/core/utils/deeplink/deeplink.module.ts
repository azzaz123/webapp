import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';
import { DeeplinkService } from './deeplink.service';

@NgModule({
  providers: [DeeplinkService],
  imports: [RouterModule, UserProfileRouteModule, ItemDetailRouteModule],
})
export class DeeplinkServiceModule {}
