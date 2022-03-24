import { NgModule } from '@angular/core';
import { parityScreenRoutedComponents, ParityScreenRoutingModule } from './parity-screen.routing.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [ParityScreenRoutingModule, QRCodeModule],
  declarations: [parityScreenRoutedComponents],
})
export class ParityScreenModule {}
