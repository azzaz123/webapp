import { NgModule } from '@angular/core';
import { parityScreenRoutedComponents, ParityScreenRoutingModule } from './parity-screen.routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  imports: [ParityScreenRoutingModule, QRCodeModule, CommonModule, ButtonModule],
  declarations: [parityScreenRoutedComponents],
})
export class ParityScreenModule {}
