import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { ItemDetailRouteModule, UserProfileRouteModule } from '@shared/pipes';

import { TransactionTrackingActionDeeplinkComponent } from './transaction-tracking-action-deeplink.component';

describe('TransactionTrackingActionDeeplinkComponent', () => {
  let component: TransactionTrackingActionDeeplinkComponent;
  let fixture: ComponentFixture<TransactionTrackingActionDeeplinkComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDetailRouteModule, UserProfileRouteModule, ImageFallbackModule],
      declarations: [TransactionTrackingActionDeeplinkComponent],
      providers: [
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingActionDeeplinkComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
    component.deeplinkAction = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
