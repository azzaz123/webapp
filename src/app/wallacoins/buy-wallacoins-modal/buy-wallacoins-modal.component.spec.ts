import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { ErrorsService } from '../../core/errors/errors.service';
import { PaymentService } from '../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pack } from '../../core/payments/pack';

describe('BuyWallacoinsModalComponent', () => {
  let component: BuyWallacoinsModalComponent;
  let fixture: ComponentFixture<BuyWallacoinsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyWallacoinsModalComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: ErrorsService, useValue: {
          show() {
          },
          i18nError() {
          }
        }
        },
        {
          provide: PaymentService, useValue: {
          orderExtrasProPack() {
            return Observable.of({});
          },
          pay() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyWallacoinsModalComponent);
    component = fixture.componentInstance;
    component.pack = new Pack(
      'id',
      100,
      100,
      'EUR',
      'wallacoins'
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
