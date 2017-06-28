import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListingComponent } from './report-listing.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ItemService } from 'shield';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ReportListingComponent', () => {
  let component: ReportListingComponent;
  let fixture: ComponentFixture<ReportListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        NgbActiveModal,
        {
          provide: ItemService, useValue: {
          getBanReasons() {
            return Observable.of([]);
          }
        }
        }
      ],
      declarations: [ ReportListingComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('selectReportListingReason', () => {
    it('should set the selectedReportListingReason with the given value', () => {
      component.selectReportListingReason(1);
      expect(component.selectedReportListingReason).toBe(1);
    });
  });
});
