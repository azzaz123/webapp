/* tslint:disable:no-unused-variable */

import { ConversationComponent } from './conversation.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConversationService } from '../../../core/conversation/conversation.service';
import { MOCK_CONVERSATION } from '../../../../tests/conversation.fixtures.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserService } from '../../../core/user/user.service';
import { Observable } from 'rxjs/Observable';


describe('Component: Conversation', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let conversationService: ConversationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MomentModule,
        NgxPermissionsModule,
        NgxPermissionsModule.forRoot()
      ],
      providers: [
        {
          provide: ConversationService, useValue: {
          stream() {
          }
        }
        },
        {
          provide: UserService, useValue: {
          isProfessional() {
            return Observable.of(true);
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

      component.onAnimationDone(new Event(''));

      expect(conversationService.stream).not.toHaveBeenCalled();
    });
  });
});

