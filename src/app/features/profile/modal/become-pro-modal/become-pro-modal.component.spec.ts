import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { BecomeProModalComponent } from './become-pro-modal.component';

describe('BecomeProModalComponent', () => {
  let component: BecomeProModalComponent;
  let fixture: ComponentFixture<BecomeProModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BecomeProModalComponent, ButtonComponent],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeProModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('CTA text', () => {
    it('should show trial text', () => {
      component.hasTrialAvailable = true;

      fixture.detectChanges();

      const submitButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
      expect(submitButton.textContent).toEqual('Free trial');
    });

    it('should show default text', () => {
      fixture.detectChanges();

      const submitButton: HTMLElement = fixture.debugElement.query(By.directive(ButtonComponent)).nativeElement;
      expect(submitButton.textContent).toEqual('Know more');
    });
  });
});
