import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { NotificationsComponent } from './notifications.component';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { By } from '@angular/platform-browser';
import { MeApiService } from '@api/me/me-api.service';
import { mappedNotificationsSettings } from '@api/fixtures/me/notifications/notifications.fixture';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let meApiService: MeApiService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, NgbButtonsModule, NgxPermissionsModule.forRoot()],
        providers: [
          {
            provide: MeApiService,
            useValue: {
              getMyNotificationsSettings() {
                return of(mappedNotificationsSettings);
              },
              setNotificationEnable() {
                return of(null);
              },
              setNotificationDisabled() {
                return of(null);
              },
            },
          },
        ],
        declarations: [NotificationsComponent],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    meApiService = TestBed.inject(MeApiService);
    fixture.detectChanges();
  });

  describe('init', () => {
    beforeEach(fakeAsync(() => {
      spyOn(component, 'getMyNotificationsSettings').and.callThrough();
      spyOn(meApiService, 'getMyNotificationsSettings').and.callThrough();
      component.ngOnInit();
      tick();
      fixture.detectChanges();
    }));

    it('should call getMyNotificationsSettings when component init', fakeAsync(() => {
      expect(component.getMyNotificationsSettings).toHaveBeenCalled();
      expect(component.notificationsSettingsGroup.length).toBeGreaterThan(0);
    }));

    it('and should render list of notifications settings', fakeAsync(() => {
      let notificationsList = fixture.debugElement.query(By.css('.Notifications-container')).nativeNode;
      expect(notificationsList.childNodes.length).toBeGreaterThan(0);
    }));
  });

  describe('should disable notification', () => {
    beforeEach(() => {
      spyOn(component, 'handleChange').and.callThrough();
      spyOn(meApiService, 'setNotificationDisabled').and.callThrough();
      const notificationLabelToggle = fixture.debugElement.query(By.css('.Notifications-settings_details_toggle')).nativeNode.childNodes[0];
      notificationLabelToggle.click();
      fixture.detectChanges();
    });

    it('it should disable a enabled notification when clicked', () => {
      expect(component.handleChange).toHaveBeenCalled();
      expect(meApiService.setNotificationDisabled).toHaveBeenCalled();
    });
  });

  describe('should enable notification', () => {
    beforeEach(() => {
      spyOn(component, 'handleChange').and.callThrough();
      spyOn(meApiService, 'setNotificationEnable').and.callThrough();
      const notificationLabelToggle = fixture.debugElement.query(By.css('.Notifications-settings_details_toggle')).nativeNode.childNodes[0];
      notificationLabelToggle.click();
      fixture.detectChanges();
    });

    it('it should enable a disabled notification when clicked', () => {
      expect(component.handleChange).toHaveBeenCalled();
      expect(meApiService.setNotificationEnable).toHaveBeenCalled();
    });
  });
});
