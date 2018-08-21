import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyProductModalComponent } from './buy-product-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { Observable } from 'rxjs/Observable';
import { MOCK_ITEM_V3, ORDER_EVENT } from '../../../../../tests/item.fixtures.spec';
import { ItemService } from '../../../../core/item/item.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../../core/payments/payment.service';
import { EventService } from '../../../../core/event/event.service';

describe('BuyProductModalComponent', () => {
  let component: BuyProductModalComponent;
  let fixture: ComponentFixture<BuyProductModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyProductModalComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        EventService,
        {
          provide: ItemService, useValue: {
          get() {
            return Observable.of(MOCK_ITEM_V3);
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
          close() {
          },
          dismiss() {
          }
        }
        },
        {
          provide: PaymentService, useValue: {
          getCreditInfo() {
            return Observable.of({});
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyProductModalComponent);
    component = fixture.componentInstance;
    component.orderEvent = ORDER_EVENT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
