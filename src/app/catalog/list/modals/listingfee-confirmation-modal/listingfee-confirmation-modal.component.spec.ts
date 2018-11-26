import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingfeeConfirmationModalComponent } from './listingfee-confirmation-modal.component';

describe('ListingfeeConfirmationModalComponent', () => {
  let component: ListingfeeConfirmationModalComponent;
  let fixture: ComponentFixture<ListingfeeConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingfeeConfirmationModalComponent ]
    })
    .compileComponents();
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
