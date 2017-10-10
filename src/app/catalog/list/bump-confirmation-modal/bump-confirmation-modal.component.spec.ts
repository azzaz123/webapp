import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BumpConfirmationModalComponent } from './bump-confirmation-modal.component';

describe('BumpConfirmationModalComponent', () => {
  let component: BumpConfirmationModalComponent;
  let fixture: ComponentFixture<BumpConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BumpConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
