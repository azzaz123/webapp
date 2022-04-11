import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';
import { PayDeeplinkModule } from './pay-deeplink/pay-deeplink.module';
import { DeeplinkService } from './services/deeplink.service';

@NgModule({
  providers: [DeeplinkService],
  imports: [RouterModule, UserProfileRouteModule, ItemDetailRouteModule, PayDeeplinkModule],
})
export class DeeplinkServiceModule {}
