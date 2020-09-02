/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ConversationService } from './conversation.service';
import { TrackingService } from '../tracking/tracking.service';
import { MOCK_CONVERSATION } from '../../../tests/conversation.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendPhoneComponent } from '../../chat/modals/send-phone/send-phone.component';

let service: ConversationService;
let trackingService: TrackingService;
let modalService: NgbModal;

const componentInstance: any = { SendPhoneComponent: jasmine.createSpy('SendPhoneComponent') };

describe('Service: Conversation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversationService,
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              };
            }
          }
        }
      ]
    });
    service = TestBed.inject(ConversationService);
    trackingService = TestBed.inject(TrackingService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should instantiate the service', () => {
    expect(service).toBeTruthy();
  });

  describe('openPhonePopup', () => {
    const conversation = MOCK_CONVERSATION();
    const modalOptions = { windowClass: 'phone-request', backdrop: 'static', keyboard: false };

    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();
    });

    it('should open phoneRequest modal when the button is clicked', () => {
      service.openPhonePopup(conversation);

      expect(modalService.open).toHaveBeenCalledWith(SendPhoneComponent, modalOptions);
    });

    it('should set the modal conversation to the currentConversation, when the modal is opened', () => {
      service['modalRef'] = <any>{ componentInstance: componentInstance };

      service.openPhonePopup(conversation);

      expect(service['modalRef'].componentInstance.conversation).toBe(conversation);
    });

    it('should call trackingService.track with ITEM_SHAREPHONE_SHOWFORM when called with required TRUE', () => {
      spyOn(trackingService, 'track');

      service.openPhonePopup(conversation, true);

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.ITEM_SHAREPHONE_SHOWFORM, { item_id: conversation.item.id });
    });
  });
});
