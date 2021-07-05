/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ProcessAllButtonComponent } from './process-all-button.component';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CallsService } from '../../core/conversation/calls.service';

describe('ProcessAllButtonComponent', () => {
  let component: ProcessAllButtonComponent;
  let fixture: ComponentFixture<ProcessAllButtonComponent>;
  let modal: NgbModal;
  let callsService: CallsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                };
              },
            },
          },
          {
            provide: CallsService,
            useValue: {
              archiveAll() {
                return of({});
              },
            },
          },
        ],
        declarations: [ProcessAllButtonComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessAllButtonComponent);
    component = fixture.componentInstance;
    modal = TestBed.inject(NgbModal);
    callsService = TestBed.inject(CallsService);
    fixture.detectChanges();
  });

  describe('open', () => {
    beforeEach(() => {
      spyOn(modal, 'open').and.callThrough();
    });

    it('should open modal', () => {
      component.open('modal');

      expect(modal.open).toHaveBeenCalledWith('modal');
    });

    it('should call callsService.archiveAll if type calls', fakeAsync(() => {
      spyOn(callsService, 'archiveAll').and.callThrough();
      component.type = 'calls';

      component.open('modal');
      tick();

      expect(callsService.archiveAll).toHaveBeenCalled();
    }));
  });
});
