/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProcessAllButtonComponent } from './process-all-button.component';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConversationService } from '../../core/conversation/conversation.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';

describe('ProcessAllButtonComponent', () => {
  let component: ProcessAllButtonComponent;
  let fixture: ComponentFixture<ProcessAllButtonComponent>;
  let modal: NgbModal;
  let conversationService: ConversationService;
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
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  describe('open', () => {
    beforeEach(() => {
      spyOn(modal, 'open').and.callThrough();
      spyOn(conversationService, 'archiveAll').and.callThrough();
    });

    it('should open modal', () => {
      component.open('modal');

      expect(modal.open).toHaveBeenCalledWith('modal');
    });

    it('should call conversationService.archiveAll if type conversations', fakeAsync(() => {
      component.type = 'conversations';

      component.open('modal');
      tick();
      
      expect(conversationService.archiveAll).toHaveBeenCalled();
    }));
  });

});
