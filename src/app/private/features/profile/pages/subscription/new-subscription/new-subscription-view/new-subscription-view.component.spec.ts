import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubscriptionViewComponent } from './new-subscription-view.component';

describe('NewSubscriptionViewComponent', () => {
  let component: NewSubscriptionViewComponent;
  let fixture: ComponentFixture<NewSubscriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSubscriptionViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubscriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
