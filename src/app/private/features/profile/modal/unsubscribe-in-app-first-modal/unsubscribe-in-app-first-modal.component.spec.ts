import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeInAppFirstModal } from './unsubscribe-in-app-first-modal.component';

describe('UnsubscribeInAppFirstModal', () => {
  let component: UnsubscribeInAppFirstModal;
  let fixture: ComponentFixture<UnsubscribeInAppFirstModal>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UnsubscribeInAppFirstModal],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeInAppFirstModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
