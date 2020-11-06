/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnarchiveButtonComponent } from './unarchive-button.component';
import { of } from 'rxjs';
import { Lead } from '../../core/conversation/lead';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { CallsService } from '../../core/conversation/calls.service';
import { CALL_ID, MOCK_CALL } from '../../../tests/call.fixtures';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('UnarchiveButtonComponent', () => {
  let component: UnarchiveButtonComponent;
  let fixture: ComponentFixture<UnarchiveButtonComponent>;
  let callsService: CallsService;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule],
      providers: [
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: CallsService,
          useValue: {
            unarchive() {
              return of({});
            },
          },
        },
      ],
      declarations: [UnarchiveButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnarchiveButtonComponent);
    component = fixture.componentInstance;
    callsService = TestBed.inject(CallsService);
    trackingService = TestBed.inject(TrackingService);
    fixture.detectChanges();
  });

  describe('unarchive', () => {
    beforeEach(() => {
      spyOn(trackingService, 'track').and.callThrough();
    });

    it('should call unarchive call if the lead is call and send a call mark pending track', () => {
      spyOn(callsService, 'unarchive').and.callThrough();
      component.lead = <Lead>MOCK_CALL();

      component.unarchive(new Event('click'));

      expect(callsService.unarchive).toHaveBeenCalledWith(CALL_ID);
      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.CALLS_MARK_PENDING
      );
    });
  });
});
