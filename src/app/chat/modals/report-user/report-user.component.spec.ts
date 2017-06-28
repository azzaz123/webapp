import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUserComponent } from './report-user.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/user/user.service';

describe('ReportUserComponent', () => {
  let component: ReportUserComponent;
  let fixture: ComponentFixture<ReportUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        NgbActiveModal,
        {
          provide: UserService, useValue: {
          getBanReasons() {
            return Observable.of([]);
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
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('selectReportUserReason', () => {
    it('should set the selectedReportUserReason with the given value', () => {
      component.selectReportUserReason(1);
      expect(component.selectedReportUserReason).toBe(1);
    });
  });
});
