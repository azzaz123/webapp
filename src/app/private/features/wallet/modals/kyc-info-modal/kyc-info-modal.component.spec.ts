import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycInfoModalComponent } from './kyc-info-modal.component';

describe('KycInfoModalComponent', () => {
  let component: KycInfoModalComponent;
  let fixture: ComponentFixture<KycInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycInfoModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
