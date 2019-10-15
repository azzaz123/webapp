import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelSubscriptionModalComponent } from './cancel-subscription-modal.component';
import { MAPPED_SUBSCRIPTIONS, TIER } from '../../../../tests/subscriptions.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

describe('CancelSubscriptionModalComponent', () => {
  let component: CancelSubscriptionModalComponent;
  let fixture: ComponentFixture<CancelSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let eventService: EventService;
  let subscriptionsService: SubscriptionsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionModalComponent ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(true),
                componentInstance: {}
              };
            }
          }
        },
        {
          provide: SubscriptionsService, useValue: {
            cancelSubscription() {
              return Observable.of({});
            }
          }
        },
        I18nService,
        EventService,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(NgbActiveModal);
    eventService = TestBed.get(EventService);
    subscriptionsService = TestBed.get(SubscriptionsService);
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    fixture.detectChanges();
  });

  describe('close', () => {
    it('should close the modal and redirect to the profile', () => {
      spyOn(activeModal, 'close');

      component.close();

      expect(activeModal.close).toHaveBeenCalled();
    })
  })

  describe('cancelSubscription', () => {
    it('should call the cancelsubscription service', () => {
      const tier = TIER;

      component.cancelSubscription();

      expect(component.subscriptionsService.cancelSubscription).toHaveBeenCalledWith(tier.id);
    });
  });

});