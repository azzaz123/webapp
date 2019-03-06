import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWithInboxComponent } from './chat-with-inbox.component';

describe('ChatWithInboxComponent', () => {
  let component: ChatWithInboxComponent;
  let fixture: ComponentFixture<ChatWithInboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWithInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWithInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
