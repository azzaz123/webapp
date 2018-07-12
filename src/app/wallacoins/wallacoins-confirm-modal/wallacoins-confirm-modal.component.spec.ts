import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal.component';

describe('WallacoinsConfirmModalComponent', () => {
  let component: WallacoinsConfirmModalComponent;
  let fixture: ComponentFixture<WallacoinsConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsConfirmModalComponent ]
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
