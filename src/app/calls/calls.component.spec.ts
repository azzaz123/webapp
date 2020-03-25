
import {of as observableOf,  Observable } from 'rxjs';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CallsComponent } from './calls.component';
import { CallsService } from '../core/conversation/calls.service';
import { ActivatedRoute } from '@angular/router';
import { TrackingService } from '../core/tracking/tracking.service';
import { MockTrackingService } from '../../tests/tracking.fixtures.spec';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { createCallsArray } from '../../tests/call.fixtures';
import { Call } from '../core/conversation/calls';

describe('CallsComponent', () => {
  let component: CallsComponent;
  let fixture: ComponentFixture<CallsComponent>;
  let callService: CallsService;
  let route: ActivatedRoute;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CallsComponent],
      providers: [
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: CallsService, useValue: {
          getPage() {
            return observableOf([]);
          }
        }
        },
        {
          provide: ActivatedRoute, useValue: {
          queryParams: observableOf({})
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    callService = TestBed.get(CallsService);
    route = TestBed.get(ActivatedRoute);
    trackingService = TestBed.get(TrackingService);
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
      route.queryParams = observableOf({
        status: 'test'
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
        spyOn(callService, 'getPage').and.returnValue(observableOf(CALLS));
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
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_LIST_ACTIVE_LOADED);
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
          expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PHONE_LEAD_LIST_PROCESSED_LOADED);
        });
      });
    });

    describe('if a subscription already exists', () => {
      it('should unsubscribe', () => {
        const SUBSCRIPTION: any = {
          unsubscribe() {}
        };
        spyOn(callService, 'getPage').and.returnValue({
          takeWhile() {
            return {
              subscribe() {
                return SUBSCRIPTION;
              }
            };
          }
        });
        
        component.getCalls();
        spyOn(SUBSCRIPTION, 'unsubscribe');
        component.getCalls();

        expect(component['callsSubscription'].unsubscribe).toHaveBeenCalled();
      });
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
