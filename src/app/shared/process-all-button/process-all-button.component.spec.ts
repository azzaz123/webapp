/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProcessAllButtonComponent } from './process-all-button.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { CallsService } from '../../core/conversation/calls.service';

describe('ProcessAllButtonComponent', () => {
  let component: ProcessAllButtonComponent;
  let fixture: ComponentFixture<ProcessAllButtonComponent>;
  let modal: NgbModal;
  let conversationService: ConversationService;
  let callsService: CallsService;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TrackingService, useClass: MockTrackingService
        },
        {
          provide: ConversationService, useValue: {
          archiveAll() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve()
              };
            }
        }
        },
        {
          provide: CallsService, useValue: {
            archiveAll() {
              return Observable.of({});
            }
          }
        }
      ],
      declarations: [ ProcessAllButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAllButtonComponent);
    component = fixture.componentInstance;
    modal = TestBed.get(NgbModal);
    conversationService = TestBed.get(ConversationService);
    callsService = TestBed.get(CallsService);
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  describe('open', () => {
    beforeEach(() => {
      spyOn(modal, 'open').and.callThrough();
      spyOn(trackingService, 'track').and.callThrough();
    });

    it('should open modal', () => {
      component.open('modal');

      expect(modal.open).toHaveBeenCalledWith('modal');
    });

    it('should call conversationService.archiveAll if type conversations and emit a track to conversation', fakeAsync(() => {
      spyOn(conversationService, 'archiveAll').and.callThrough();
      component.type = 'conversations';

      component.open('modal');
      tick();
      
      expect(conversationService.archiveAll).toHaveBeenCalled();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_ALL_PROCESSED);
    }));

    it('should call callsService.archiveAll if type calls and emit a track to calls', fakeAsync(() => {
      spyOn(callsService, 'archiveAll').and.callThrough();
      component.type = 'calls';

      component.open('modal');
      tick();

      expect(callsService.archiveAll).toHaveBeenCalled();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_LIST_ALL_PROCESSED);
    }));
  });

});
