import { NgModule } from '@angular/core';
import { parityScreenRoutedComponents, ParityScreenRoutingModule } from './parity-screen.routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@shared/button/button.module';
import { QrIconInjectorService } from '@shared/qr-icon-injector/qr-icon-injector.service';

@NgModule({
  imports: [ParityScreenRoutingModule, QRCodeModule, CommonModule, ButtonModule],
  declarations: [parityScreenRoutedComponents],
  providers: [QrIconInjectorService],
})
export class ParityScreenModule {}
