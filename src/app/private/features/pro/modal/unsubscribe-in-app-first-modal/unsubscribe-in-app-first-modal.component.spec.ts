import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnsubscribeInAppFirstModalComponent } from './unsubscribe-in-app-first-modal.component';

describe('UnsubscribeInAppFirstModal', () => {
  let component: UnsubscribeInAppFirstModalComponent;
  let fixture: ComponentFixture<UnsubscribeInAppFirstModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UnsubscribeInAppFirstModalComponent],
        providers: [NgbActiveModal],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeInAppFirstModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
