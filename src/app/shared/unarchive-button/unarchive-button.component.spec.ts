/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UnarchiveButtonComponent } from './unarchive-button.component';
import { of } from 'rxjs';
import { Lead } from '../../core/conversation/lead';
import { CallsService } from '../../core/conversation/calls.service';
import { CALL_ID, MOCK_CALL } from '../../../tests/call.fixtures';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('UnarchiveButtonComponent', () => {
  let component: UnarchiveButtonComponent;
  let fixture: ComponentFixture<UnarchiveButtonComponent>;
  let callsService: CallsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgbModule],
        providers: [
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UnarchiveButtonComponent);
    component = fixture.componentInstance;
    callsService = TestBed.inject(CallsService);
    fixture.detectChanges();
  });

  describe('unarchive', () => {
    it('should call unarchive call if the lead is call and send a call mark pending track', () => {
      spyOn(callsService, 'unarchive').and.callThrough();
      component.lead = <Lead>MOCK_CALL();

      component.unarchive(new Event('click'));

      expect(callsService.unarchive).toHaveBeenCalledWith(CALL_ID);
    });
  });
});
