import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { AcceptScreenComponent } from '../accept-screen/accept-screen.component';

@NgModule({
  imports: [AcceptScreenRoutingModule],
  declarations: [acceptScreenRoutedComponents, AcceptScreenComponent],
})
export class AcceptScreenModule {}
