import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CancelSubscriptionModalComponent } from './cancel-subscription-modal.component';
import { MAPPED_SUBSCRIPTIONS, TIER } from '../../../../tests/subscriptions.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { SubscriptionsService } from '../../../core/subscriptions/subscriptions.service';
import { Observable } from 'rxjs';

describe('CancelSubscriptionModalComponent', () => {
  let component: CancelSubscriptionModalComponent;
  let fixture: ComponentFixture<CancelSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let eventService: EventService;
  let subscriptionsService: SubscriptionsService;
  let toastrService: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionModalComponent ],
      providers: [

        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: ToastrService, useValue: {
            error() {
            },
            success() {
            },
            i18nError() {
            },
            i18nSuccess() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: {}
              };
            }
          }
        },
        {
          provide: SubscriptionsService, useValue: {
            cancelSubscription() {
              return Observable.of(202);
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
    toastrService = TestBed.get(ToastrService);
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
    const tier = MAPPED_SUBSCRIPTIONS[2].selected_tier;

    it('should call the cancelsubscription service', () => {
      spyOn(subscriptionsService, 'cancelSubscription').and.returnValue(Observable.of({status: 202}));

      component.cancelSubscription();
      
      expect(component.subscriptionsService.cancelSubscription).toHaveBeenCalledWith(tier.id);
      expect(component.loading).toBe(false);
    });

    it('should emit the subscription changed event', () => {
      spyOn(subscriptionsService, 'cancelSubscription').and.returnValue(Observable.of({status: 202}));
      spyOn(eventService, 'emit');
      spyOn(toastrService, 'success').and.callThrough();

      component.cancelSubscription();

      expect(eventService.emit).toHaveBeenCalledWith('subscriptionChange');
    });
  });

});