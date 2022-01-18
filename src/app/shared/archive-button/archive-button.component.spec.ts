/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArchiveButtonComponent } from './archive-button.component';
import { of } from 'rxjs';
import { CallsService } from '../../core/conversation/calls.service';
import { CALL_ID, MOCK_CALL } from '../../../tests/call.fixtures';

describe('ArchiveButtonComponent', () => {
  let component: ArchiveButtonComponent;
  let fixture: ComponentFixture<ArchiveButtonComponent>;
  let callsService: CallsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveButtonComponent);
    component = fixture.componentInstance;
    callsService = TestBed.inject(CallsService);
    fixture.detectChanges();
  });

  describe('archive', () => {
    let called: boolean;

    beforeEach(() => {
      component.handleClick.subscribe(() => {
        called = true;
      });
    });

    it('should call callService.archive if lead is Call', () => {
      spyOn(callsService, 'archive').and.callThrough();
      component.lead = MOCK_CALL();

      component.archive(new Event(''));

      expect(callsService.archive).toHaveBeenCalledWith(CALL_ID);
    });

    it('should emit click event', () => {
      spyOn(callsService, 'archive').and.callThrough();

      component.lead = MOCK_CALL();
      component.archive(new Event(''));

      expect(called).toBe(true);
    });
  });
});
