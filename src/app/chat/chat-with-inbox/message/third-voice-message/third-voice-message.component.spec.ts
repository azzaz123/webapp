import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ThirdVoiceMessageComponent } from './third-voice-message.component';
import { LinkTransformPipe } from '../../../../shared/pipes/link-transform';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../../tests/inbox.fixtures.spec';

describe('ThirdVoiceMessageComponent', () => {
  let component: ThirdVoiceMessageComponent;
  let fixture: ComponentFixture<ThirdVoiceMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThirdVoiceMessageComponent, LinkTransformPipe],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceMessageComponent);
    component = fixture.componentInstance;
    component.message = CREATE_MOCK_INBOX_CONVERSATION().messages[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
