import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdVoiceDropPriceComponent } from './third-voice-drop-price.component';
import { ThirdVoiceReviewButtonComponent } from '../third-voice-review-button';
import { ThirdVoiceMessageComponent } from '../third-voice-message';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../../tests/inbox.fixtures.spec';

describe('ThirdVoiceDropPriceComponent', () => {
  let component: ThirdVoiceDropPriceComponent;
  let fixture: ComponentFixture<ThirdVoiceDropPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [
        ThirdVoiceDropPriceComponent,
        ThirdVoiceMessageComponent,
        ThirdVoiceReviewButtonComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceDropPriceComponent);
    component = fixture.componentInstance;
    component.message = component.message = CREATE_MOCK_INBOX_CONVERSATION().messages[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
