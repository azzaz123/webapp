import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextMessageComponent } from './text-message.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../../tests/inbox.fixtures.spec';
import { LinkTransformPipe } from '../../../../shared/pipes/link-transform';

describe('TextMessageComponent', () => {
  let component: TextMessageComponent;
  let fixture: ComponentFixture<TextMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextMessageComponent, LinkTransformPipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextMessageComponent);
    component = fixture.componentInstance;
    component.message = CREATE_MOCK_INBOX_CONVERSATION().messages[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

