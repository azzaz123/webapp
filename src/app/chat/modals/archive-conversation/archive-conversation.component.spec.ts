import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveConversationComponent } from './archive-conversation.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ArchiveConversationComponent', () => {
  let component: ArchiveConversationComponent;
  let fixture: ComponentFixture<ArchiveConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [ ArchiveConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
