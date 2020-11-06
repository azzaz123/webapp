import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchiveInboxConversationComponent } from './archive-inbox-conversation.component';
import { NgxPermissionsModule } from 'ngx-permissions';

describe('ArchiveInboxConversationComponent', () => {
  let component: ArchiveInboxConversationComponent;
  let fixture: ComponentFixture<ArchiveInboxConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forRoot()],
      providers: [NgbActiveModal],
      declarations: [ArchiveInboxConversationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveInboxConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
