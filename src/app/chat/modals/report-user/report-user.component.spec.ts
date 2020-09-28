
import { of } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUserComponent } from './report-user.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { BanReason } from '../../../core/item/ban-reason.interface';

describe('ReportUserComponent', () => {
  let component: ReportUserComponent;
  let fixture: ComponentFixture<ReportUserComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;

  const BAN_REASONS: BanReason[] = [{
    id: 1,
    label: 'ban reason'
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        NgbActiveModal,
        {
          provide: UserService, useValue: {
          getBanReasons() {
            return of(BAN_REASONS);
          }
        }
        }
      ],
      declarations: [ ReportUserComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    activeModal = TestBed.inject(NgbActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get and set ban reasons', () => {
      spyOn(userService, 'getBanReasons').and.callThrough();
      component.ngOnInit();
      expect(userService.getBanReasons).toHaveBeenCalled();
      expect(component.userBanReasons).toEqual(BAN_REASONS);
    });
  });

  describe('selectReportUserReason', () => {
    it('should set the selectedReportUserReason with the given value', () => {
      component.selectReportUserReason(1);
      expect(component.selectedReportUserReason).toBe(1);
    });
  });

  describe('close', () => {
    it('should call close', () => {
      spyOn(activeModal, 'close');
      component.reportUserReasonMessage = 'message';
      component.selectedReportUserReason = 1;
      component.close();
      expect(activeModal.close).toHaveBeenCalledWith({
        message: 'message',
        reason: 1
      });
    });
  });
});
