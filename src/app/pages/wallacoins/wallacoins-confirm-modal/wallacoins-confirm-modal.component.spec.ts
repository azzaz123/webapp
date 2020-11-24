import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../../shared/pipes';
import { Pack } from '../../../core/payments/pack';

describe('WallacoinsConfirmModalComponent', () => {
  let component: WallacoinsConfirmModalComponent;
  let fixture: ComponentFixture<WallacoinsConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WallacoinsConfirmModalComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
            dismiss() {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsConfirmModalComponent);
    component = fixture.componentInstance;
    component.pack = new Pack('id', 100, 100, 'EUR', 'wallacoins');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
