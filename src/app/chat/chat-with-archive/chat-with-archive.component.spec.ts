import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWithArchiveComponent } from './chat-with-archive.component';

describe('ChatWithArchiveComponent', () => {
  let component: ChatWithArchiveComponent;
  let fixture: ComponentFixture<ChatWithArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatWithArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWithArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
