import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeInAppFirstModal } from './unsubscribe-in-app-first-modal.component';

describe('UnsubscribeInAppFirstModal', () => {
  let component: UnsubscribeInAppFirstModal;
  let fixture: ComponentFixture<UnsubscribeInAppFirstModal>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeInAppFirstModal ]
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
