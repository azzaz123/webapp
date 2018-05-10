import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ProUrgentConfirmationModalComponent
} from './pro-urgent-confirmation-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindowRef } from '../../../../../core/window/window.service';
import { UserService } from '../../../../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { MOCK_USER } from '../../../../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../../../../../core/tracking/tracking.service';

describe('UrgentConfirmationModalComponent', () => {
  let component: ProUrgentConfirmationModalComponent;
  let fixture: ComponentFixture<ProUrgentConfirmationModalComponent>;
  let activeModal: NgbActiveModal;
  let trackingService: TrackingService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProUrgentConfirmationModalComponent ],
      providers: [
        WindowRef,
        NgbActiveModal,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: UserService, useValue: {
            me() {
              return Observable.of(MOCK_USER);
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProUrgentConfirmationModalComponent);
    activeModal = TestBed.get(NgbActiveModal);
    trackingService = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
});
