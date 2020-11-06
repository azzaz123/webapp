import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingfeeConfirmationModalComponent } from './listingfee-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListingfeeConfirmationModalComponent', () => {
  let component: ListingfeeConfirmationModalComponent;
  let fixture: ComponentFixture<ListingfeeConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListingfeeConfirmationModalComponent],
      providers: [
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
    fixture = TestBed.createComponent(ListingfeeConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
