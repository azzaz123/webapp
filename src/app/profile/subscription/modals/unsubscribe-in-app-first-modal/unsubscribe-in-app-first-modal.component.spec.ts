import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeInAppFirstModal } from './unsubscribe-in-app-first-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('UnsubscribeInAppFirstModal', () => {
  let component: UnsubscribeInAppFirstModal;
  let fixture: ComponentFixture<UnsubscribeInAppFirstModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeInAppFirstModal ],
      providers: [
        NgbActiveModal
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeInAppFirstModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
