import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { CoreModule } from '@core/core.module';
import { I18nService } from '@core/i18n/i18n.service';
import { ItemRouteMockDirective } from '@fixtures/item-route.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { CustomCurrencyPipe } from '@shared/pipes';
import { NotificationsInboxComponent } from './notifications-inbox.component';

describe('NotificationsInboxComponent', () => {
  let component: NotificationsInboxComponent;
  let fixture: ComponentFixture<NotificationsInboxComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsInboxComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
