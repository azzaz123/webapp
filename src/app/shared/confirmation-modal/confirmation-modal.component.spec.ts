import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationModalComponent } from './confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [NgbActiveModal],
        declarations: [ConfirmationModalComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
