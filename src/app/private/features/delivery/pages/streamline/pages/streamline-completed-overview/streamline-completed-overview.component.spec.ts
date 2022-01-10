import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

import { StreamlineCompletedOverviewComponent } from './streamline-completed-overview.component';

describe('StreamlineCompletedOverviewComponent', () => {
  let component: StreamlineCompletedOverviewComponent;
  let fixture: ComponentFixture<StreamlineCompletedOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StreamlineCompletedOverviewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineCompletedOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the buys path as retry url when the petition fails', () => {
    const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`;
    expect(component.retryUrl).toStrictEqual(expectedUrl);
  });
});
