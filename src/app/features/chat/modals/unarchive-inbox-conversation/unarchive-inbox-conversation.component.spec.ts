import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnarchiveInboxConversationComponent } from './unarchive-inbox-conversation.component';

describe('UnarchiveInboxConversationComponent', () => {
  let component: UnarchiveInboxConversationComponent;
  let fixture: ComponentFixture<UnarchiveInboxConversationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [NgbActiveModal],
        declarations: [UnarchiveInboxConversationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UnarchiveInboxConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
