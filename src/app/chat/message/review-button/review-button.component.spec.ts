import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewButtonComponent } from './review-button.component';

describe('ReviewButtonComponent', () => {
  let component: ReviewButtonComponent;
  let fixture: ComponentFixture<ReviewButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
