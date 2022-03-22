import { NgModule } from '@angular/core';
import { parityScreenRoutedComponents, ParityScreenRoutingModule } from './parity-screen.routing.module';

@NgModule({
  imports: [ParityScreenRoutingModule],
  declarations: [parityScreenRoutedComponents],
})
export class ParityScreenModule {}
