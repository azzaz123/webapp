import { Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'qrcode',
  template: '',
})
export class QrCodeStubComponent {
  @Input() qrdata: string;
  @Input() width: number;
  @Input() margin: number;
  @Input() errorCorrectionLevel: string;
}
