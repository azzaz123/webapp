import { MockTrackingService } from './../../../../tests/tracking.fixtures.spec';
import { of, Subscription } from 'rxjs';
/* tslint:disable:no-unused-variable */
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { CallsComponent } from './calls.component';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Call } from 'app/core/conversation/calls';
import { CallsService } from 'app/core/conversation/calls.service';
import { TrackingService } from 'app/core/tracking/tracking.service';
import { createCallsArray } from './../../../../tests/call.fixtures';

describe('CallsComponent', () => {
  let component: CallsComponent;
  let fixture: ComponentFixture<CallsComponent>;
  let callService: CallsService;
  let route: ActivatedRoute;
  let trackingService: TrackingService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CallsComponent],
        providers: [
          { provide: TrackingService, useClass: MockTrackingService },
          {
            provide: CallsService,
            useValue: {
              getPage() {
                return of([]);
              },
            },
          },
          {
            provide: ActivatedRoute,
            useValue: {
              queryParams: of({}),
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    callService = TestBed.inject(CallsService);
    route = TestBed.inject(ActivatedRoute);
    trackingService = TestBed.inject(TrackingService);
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getCalls');

      component.ngOnInit();
    });

    it('should set loading to true', () => {
      expect(component.loading).toBeTruthy();
    });

    it('should call getCalls', () => {
      expect(component['getCalls']).toHaveBeenCalled();
    });

    it('should set status', () => {
      route.queryParams = of({
        status: 'test',
      });

      component.ngOnInit();

      expect(component.status).toBe('test');
    });
  });

  describe('loadMore', () => {
    beforeEach(() => {
      spyOn(component, 'getCalls');
      component['page'] = 1;

      component.loadMore();
    });

    it('should increment page', () => {
      expect(component['page']).toBe(2);
    });

    it('should call getCalls', () => {
      expect(component['getCalls']).toHaveBeenCalled();
    });
  });

  describe('getCalls', () => {
    describe('starting with no calls', () => {
      const CALLS: Call[] = createCallsArray(4);

      beforeEach(() => {
        spyOn(callService, 'getPage').and.returnValue(of(CALLS));
        component['page'] = 1;
      });

      describe('no archive', () => {
        beforeEach(() => {
          component.status = 'SHARED';
          spyOn(trackingService, 'track');

          component['getCalls']();
        });

        it('should call getPage', () => {
          expect(callService.getPage).toHaveBeenCalledWith(1, false, 'SHARED');
        });

        it('should replace calls', () => {
          expect(component.calls).toEqual(CALLS);
        });

        it('should set loading to false', () => {
          expect(component.loading).toBeFalsy();
        });

        it('should track the PoneLeadListActiveLoaded', () => {
          expect(trackingService.track).toHaveBeenCalledWith(
            TrackingService.PHONE_LEAD_LIST_ACTIVE_LOADED
          );
        });
      });

      describe('archive', () => {
        beforeEach(() => {
          component.archive = true;
          spyOn(trackingService, 'track');

          component['getCalls']();
        });

        it('should call getPage', () => {
          expect(callService.getPage).toHaveBeenCalledWith(1, true, undefined);
        });

        it('should replace calls', () => {
          expect(component.calls).toEqual(CALLS);
        });

        it('should set loading to false', () => {
          expect(component.loading).toBeFalsy();
        });

        it('should track the PoneLeadListProcessedLoaded', () => {
          expect(trackingService.track).toHaveBeenCalledWith(
            TrackingService.PHONE_LEAD_LIST_PROCESSED_LOADED
          );
        });
      });
    });

    describe('if a subscription already exists', () => {
      it('should unsubscribe', fakeAsync(() => {
        const SUBSCRIPTION = new Subscription();

        component['callsSubscription'] = SUBSCRIPTION;
        spyOn(callService, 'getPage').and.returnValue(of(SUBSCRIPTION));
        spyOn(component['callsSubscription'], 'unsubscribe');

        component.getCalls();
        tick();
        component.getCalls();

        expect(SUBSCRIPTION.unsubscribe).toHaveBeenCalled();
      }));
    });
  });

  describe('filterByArchived', () => {
    beforeEach(() => {
      spyOn(component, 'getCalls');
      spyOn(trackingService, 'track');
      component['page'] = 10;
    });

    it('should set archive true', () => {
      component.filterByArchived(true);

      expect(component.archive).toBeTruthy();
      expect(component['page']).toBe(1);
      expect(component['getCalls']).toHaveBeenCalled();
    });

    it('should set archive false', () => {
      component.filterByArchived(false);

      expect(component.archive).toBeFalsy();
      expect(component['page']).toBe(1);
      expect(component['getCalls']).toHaveBeenCalled();
    });
  });
});
