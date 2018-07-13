import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('WallacoinsConfirmModalComponent', () => {
  let component: WallacoinsConfirmModalComponent;
  let fixture: ComponentFixture<WallacoinsConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsConfirmModalComponent ],
      providers: [{
        provide: NgbActiveModal, useValue: {
          close() {
          },
          dismiss() {
          }
        }
      }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
