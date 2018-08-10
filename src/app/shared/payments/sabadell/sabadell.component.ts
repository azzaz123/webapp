import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaymentService } from '../../../core/payments/payment.service';
import { SabadellInfoResponse } from '../../../core/payments/payment.interface';

@Component({
  selector: 'tsl-sabadell',
  templateUrl: './sabadell.component.html'
})
export class SabadellComponent implements OnInit {

  @Input() submit: EventEmitter<string> = new EventEmitter();
  @ViewChild('sabadellForm') sabadellForm: any;
  sabadellFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private paymentService: PaymentService) {
    this.sabadellFormGroup = fb.group({
      Ds_SignatureVersion: '',
      Ds_MerchantParameters: '',
      Ds_Signature: ''
    });
  }

  ngOnInit() {
    this.submit.subscribe((orderId: string) => {
      this.paymentService.getSabadellInfo(orderId).subscribe((sabadellInfo: SabadellInfoResponse) => {
        this.sabadellForm.nativeElement.action = sabadellInfo.target_url;
        this.sabadellFormGroup.patchValue({
          Ds_SignatureVersion: sabadellInfo.signature_version,
          Ds_MerchantParameters: sabadellInfo.merchant_parameters,
          Ds_Signature: sabadellInfo.signature
        });
        this.sabadellForm.nativeElement.submit();
      });
    });
  }

}
