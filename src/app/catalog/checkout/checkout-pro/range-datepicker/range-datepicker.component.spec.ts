import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { RangeDatepickerComponent } from './range-datepicker.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('RangeDatepickerComponent', () => {
  let component: RangeDatepickerComponent;
  let fixture: ComponentFixture<RangeDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RangeDatepickerComponent],
      providers: [NgbCalendar],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
