import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

  it('should contain the streamline completed', () => {
    expect(fixture.debugElement.query(By.css('tsl-streamline-completed'))).toBeTruthy();
  });

  it('should implement the error catcher', () => {
    const expectedUrl = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BUYS}`;
    const errorCatcherComponent = fixture.debugElement.query(By.css('tsl-shared-error-action'));

    expect(errorCatcherComponent).toBeTruthy();
    expect(errorCatcherComponent.nativeElement.retryUrl).toStrictEqual(expectedUrl);
  });
});
