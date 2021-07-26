import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeStoreLocationModal } from './change-store-location-modal.component';

describe('BecomeProModalComponent', () => {
  let component: ChangeStoreLocationModal;
  let fixture: ComponentFixture<ChangeStoreLocationModal>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChangeStoreLocationModal],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStoreLocationModal);
    component = fixture.componentInstance;
  });

  describe('CTA text', () => {
    beforeEach(() => {
      spyOn(window as any, '$localize');
    });

    it('should show trial text', () => {
      component.hasTrialAvailable = true;
      fixture.detectChanges();

      expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_free_trial:')]);
    });

    it('should show default text', () => {
      fixture.detectChanges();

      expect(window['$localize']).toHaveBeenCalledWith([expect.stringMatching(':@@web_know_more:')]);
    });
  });
});
