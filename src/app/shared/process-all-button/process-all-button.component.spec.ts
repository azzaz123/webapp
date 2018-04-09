/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProcessAllButtonComponent } from './process-all-button.component';
import { ConversationService, MockTrackingService, TrackingService } from 'shield';
import { Observable } from 'rxjs/Observable';
import { CallService } from '../call.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('ProcessAllButtonComponent', () => {
  let component: ProcessAllButtonComponent;
  let fixture: ComponentFixture<ProcessAllButtonComponent>;
  let modal: NgbModal;
  let conversationService: ConversationService;
  let callService: CallService;
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
          provide: CallService, useValue: {
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
    callService = TestBed.get(CallService);
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    beforeEach(() => {
      spyOn(modal, 'open').and.callThrough();
      spyOn(conversationService, 'archiveAll').and.callThrough();
      spyOn(callService, 'archiveAll').and.callThrough();
    });
    it('should open modal', () => {
      component.open('modal');
      expect(modal.open).toHaveBeenCalledWith('modal');
    });
    it('should call callService.archiveAll if type calls', fakeAsync(() => {
      component.type = 'calls';
      component.open('modal');
      tick();
      expect(callService.archiveAll).toHaveBeenCalled();
    }));
    it('should call conversationService.archiveAll if type conversations', fakeAsync(() => {
      component.type = 'conversations';
      component.open('modal');
      tick();
      expect(conversationService.archiveAll).toHaveBeenCalled();
    }));
    it('should track PHONE_LEAD_LIST_ALL_PROCESSED if type calls', fakeAsync(() => {
      spyOn(trackingService, 'track');
      component.type = 'calls';
      component.open('modal');
      tick();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_LIST_ALL_PROCESSED);
    }));
    it('should track CONVERSATION_LIST_ALL_PROCESSED if type conversations', fakeAsync(() => {
      spyOn(trackingService, 'track');
      component.type = 'conversations';
      component.open('modal');
      tick();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.CONVERSATION_LIST_ALL_PROCESSED);
    }));
  });

});
