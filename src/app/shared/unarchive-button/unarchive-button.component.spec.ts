/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnarchiveButtonComponent } from './unarchive-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConversationService, MOCK_CONVERSATION, CONVERSATION_ID } from 'shield';
import { Observable } from 'rxjs/Observable';
import { CallService } from '../call.service';
import { Call } from '../call';
import { MOCK_CALL, CALL_ID } from '../../../../test/fixtures/call.fixtures';

describe('UnarchiveButtonComponent', () => {
  let component: UnarchiveButtonComponent;
  let fixture: ComponentFixture<UnarchiveButtonComponent>;
  let conversationService: ConversationService;
  let callService: CallService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        {
          provide: ConversationService, useValue: {
          unarchive() {
            return Observable.of({});
          }
        }
        },
        {
          provide: CallService, useValue: {
          unarchive() {
            return Observable.of({});
          }
        }
        }
      ],
      declarations: [ UnarchiveButtonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnarchiveButtonComponent);
    component = fixture.componentInstance;
    conversationService = TestBed.get(ConversationService);
    callService = TestBed.get(CallService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('unarchive', () => {
    beforeEach(() => {
      spyOn(conversationService, 'unarchive').and.callThrough();
      spyOn(callService, 'unarchive').and.callThrough();
    });
    it('should call callService.unarchive if lead is Call', () => {
      const ANSWERED_CALL: Call = MOCK_CALL();
      component.lead = ANSWERED_CALL;
      component.unarchive(new Event(''));
      expect(callService.unarchive).toHaveBeenCalledWith(CALL_ID);
    });
    it('should call conversationService.unarchive if lead is Conversation', () => {
      component.lead = MOCK_CONVERSATION();
      component.unarchive(new Event(''));
      expect(conversationService.unarchive).toHaveBeenCalledWith(CONVERSATION_ID);
    });
  });
});
