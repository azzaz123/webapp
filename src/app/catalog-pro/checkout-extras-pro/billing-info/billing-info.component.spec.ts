import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingInfoComponent } from './billing-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BillingInfoComponent', () => {
  let component: BillingInfoComponent;
  let fixture: ComponentFixture<BillingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ BillingInfoComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onChanges', () => {
    it('should emit every time the form changes', () => {
      spyOn(component.billingInfoFormChange, 'emit');

      component.billingForm.patchValue({city: 'BCN'});

      expect(component.billingInfoFormChange.emit).toHaveBeenCalled();
    });
  });
});
