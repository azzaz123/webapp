import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateModalComponent } from './reactivate-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { MOCK_ITEM } from 'shield';

describe('ReactivateModalComponent', () => {
  let component: ReactivateModalComponent;
  let fixture: ComponentFixture<ReactivateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReactivateModalComponent, CustomCurrencyPipe],
      providers: [NgbActiveModal, DecimalPipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateModalComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
