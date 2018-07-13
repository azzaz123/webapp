import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsComponent } from './wallacoins.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../shared/custom-currency/custom-currency.pipe';
import { PaymentService } from '../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PerksModel } from '../core/payments/payment.model';

describe('WallacoinsComponent', () => {
  let component: WallacoinsComponent;
  let fixture: ComponentFixture<WallacoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        {
          provide: PaymentService, useValue: {
          getCreditsPacks() {
            return Observable.of([]);
          },
          getPerks() {
            return Observable.of(new PerksModel());
          }
        }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                componentInstance: {},
                result: Promise.resolve();
              }
            }
        }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
