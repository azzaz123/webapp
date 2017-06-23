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
        NoopAnimationsModule,
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

  describe('ngOnChanges', () => {
    it('should set archive', () => {
      component.conversation.archived = true;
      component.ngOnChanges();
      expect(component.archive).toBeTruthy();
    });
  });

  describe('onAnimationDone', () => {
    beforeEach(() => {
      spyOn(conversationService, 'stream');
    });
    it('should call conversationService.stream', () => {
      component.archived = true;
      component.onAnimationDone(new Event(''));
      expect(conversationService.stream).toHaveBeenCalled();
    });
    it('should do nothing if not archive', () => {
      component.archived = false;
      expect(conversationService.stream).not.toHaveBeenCalled();
    });
  });
});

