/* tslint:disable:no-unused-variable */

import { ConversationComponent } from './conversation.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { MOCK_CONVERSATION, ConversationService } from 'shield';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('Component: Conversation', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let conversationService: ConversationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MomentModule
      ],
      providers: [
        {
          provide: ConversationService, useValue: {
          stream() {
          }
        }
        }
      ],
      declarations: [ConversationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    component.conversation = MOCK_CONVERSATION();
    conversationService = TestBed.get(ConversationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

