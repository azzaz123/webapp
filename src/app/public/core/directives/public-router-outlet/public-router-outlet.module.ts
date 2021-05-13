import { NgModule } from '@angular/core';
import { PublicRouterOutletDirective } from './public-router-outlet.directive';

@NgModule({
  exports: [PublicRouterOutletDirective],
  declarations: [PublicRouterOutletDirective],
})
export class PublicRouterOutletModule {}
