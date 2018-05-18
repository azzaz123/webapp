/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnarchiveButtonComponent } from './unarchive-button.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { ConversationService } from '../../core/conversation/conversation.service';
import { CONVERSATION_ID, MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { Lead } from '../../core/conversation/lead';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';

describe('UnarchiveButtonComponent', () => {
  let component: UnarchiveButtonComponent;
  let fixture: ComponentFixture<UnarchiveButtonComponent>;
  let conversationService: ConversationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot()
      ],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ConversationService, useValue: {
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
    fixture.detectChanges();
  });

  describe('unarchive', () => {
    it('should call unarchive', () => {
      spyOn(conversationService, 'unarchive').and.callThrough();
      component.lead = <Lead>MOCK_CONVERSATION();

      component.unarchive(new Event('click'));

      expect(conversationService.unarchive).toHaveBeenCalledWith(CONVERSATION_ID)
    });
  });
});
