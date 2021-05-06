import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCountryConfirmationModalComponent } from './change-country-confirmation-modal.component';

describe('ChangeCountryConfirmationModalComponent', () => {
  let component: ChangeCountryConfirmationModalComponent;
  let fixture: ComponentFixture<ChangeCountryConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeCountryConfirmationModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCountryConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
