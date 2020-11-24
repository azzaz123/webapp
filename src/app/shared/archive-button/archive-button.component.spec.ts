/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArchiveButtonComponent } from './archive-button.component';
import { of } from 'rxjs';
import { TrackingService } from '../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { CallsService } from '../../core/conversation/calls.service';
import { CALL_ID, MOCK_CALL } from '../../../tests/call.fixtures';

describe('ArchiveButtonComponent', () => {
  let component: ArchiveButtonComponent;
  let fixture: ComponentFixture<ArchiveButtonComponent>;
  let callsService: CallsService;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: CallsService,
          useValue: {
            archive() {
              return of({});
            },
          },
        },
      ],
      declarations: [ArchiveButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveButtonComponent);
    component = fixture.componentInstance;
    callsService = TestBed.inject(CallsService);
    trackingService = TestBed.inject(TrackingService);
    fixture.detectChanges();
  });

  describe('archive', () => {
    let called: boolean;

    beforeEach(() => {
      spyOn(trackingService, 'track').and.callThrough();
      component.click.subscribe(() => {
        called = true;
      });
    });

    it('should call callService.archive if lead is Call and send call process tracking', () => {
      spyOn(callsService, 'archive').and.callThrough();
      component.lead = MOCK_CALL();

      component.archive(new Event(''));

      expect(callsService.archive).toHaveBeenCalledWith(CALL_ID);
      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.CALLS_PROCESSED
      );
    });

    it('should emit click event', () => {
      spyOn(callsService, 'archive').and.callThrough();

      component.lead = MOCK_CALL();
      component.archive(new Event(''));

      expect(called).toBe(true);
    });
  });
});
