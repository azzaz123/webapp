import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaliciousConversationModalComponent } from './malicious-conversation-modal.component';

describe('MaliciousConversationModalComponent', () => {
  let component: MaliciousConversationModalComponent;
  let fixture: ComponentFixture<MaliciousConversationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaliciousConversationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaliciousConversationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: TNS-946 - https://wallapop.atlassian.net/browse/TNS-946
  describe('Analytics', () => {
    describe('when showing modal', () => {
      it('should track modal was viewed', () => {});
    });

    describe('when closing modal', () => {
      it('should track modal was closed or dismissed', () => {});
    });
  });
});
