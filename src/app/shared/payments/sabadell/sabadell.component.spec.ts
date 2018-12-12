import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SabadellComponent } from './sabadell.component';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/payments/payment.service';
import { SABADELL_RESPONSE } from '../../../../tests/payments.fixtures.spec';

describe('SabadellComponent', () => {
  let component: SabadellComponent;
  let fixture: ComponentFixture<SabadellComponent>;
  let paymentService: PaymentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SabadellComponent],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: PaymentService, useValue: {
          getSabadellInfo() {
            return Observable.of(SABADELL_RESPONSE);
          }
        }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SabadellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
    component.sabadellForm = {
      nativeElement: {
        action: '',
        submit() {
        }
      }
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(paymentService, 'getSabadellInfo').and.callThrough();
      spyOn(component.sabadellForm.nativeElement, 'submit');
      component.ngOnInit();
      component.submit.emit('UUID');
    });
    it('should call getSabadellInfo with order id', () => {
      expect(paymentService.getSabadellInfo).toHaveBeenCalledWith('UUID');
    });
    it('should set the form', () => {
      expect(component.sabadellForm.nativeElement.action).toBe(SABADELL_RESPONSE.target_url);
      expect(component.sabadellFormGroup.get('Ds_SignatureVersion').value).toBe(SABADELL_RESPONSE.signature_version);
      expect(component.sabadellFormGroup.get('Ds_MerchantParameters').value).toBe(SABADELL_RESPONSE.merchant_parameters);
      expect(component.sabadellFormGroup.get('Ds_Signature').value).toBe(SABADELL_RESPONSE.signature);
    });
    it('should submit the form', () => {
      expect(component.sabadellForm.nativeElement.submit).toHaveBeenCalled();
    });
  });
});
