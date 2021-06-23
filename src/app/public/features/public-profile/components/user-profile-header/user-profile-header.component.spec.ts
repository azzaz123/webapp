import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PERMISSIONS } from '@core/user/user-constants';
import { MOCK_FULL_USER_FEATURED, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { UserProfileHeaderComponent } from './user-profile-header.component';

@Component({
  selector: 'tsl-user-cover',
  template: '',
})
class MockCoverUpload {}

describe('UserProfileHeaderComponent', () => {
  const profileContainerClass = '.ProfileUser__container';
  const proBadgeSelector = 'tsl-pro-badge';
  const userCoverTag = 'tsl-user-cover';
  const boldTitleClass = '.ProfileUser__container__title--bold';
  let component: UserProfileHeaderComponent;
  let fixture: ComponentFixture<UserProfileHeaderComponent>;
  let permissionService: NgxPermissionsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileHeaderComponent, MockCoverUpload],
      imports: [NgxPermissionsModule.forRoot()],
      providers: [NgxPermissionsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileHeaderComponent);
    component = fixture.componentInstance;
    component.userInfo = MOCK_FULL_USER_FEATURED;
    component.userStats = MOCK_USER_STATS;
    permissionService = TestBed.inject(NgxPermissionsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the user info and the stats', () => {
    it('should load the content', () => {
      const containerPage = fixture.debugElement.query(By.css(profileContainerClass));

      expect(containerPage).toBeTruthy();
    });

    describe('when the user is pro...', () => {
      describe('and has subscriptions permission', () => {
        beforeEach(() => {
          permissionService.addPermission(PERMISSIONS.subscriptions);
        });
        describe('when have the extra info..', () => {
          it('should show the pro elements', () => {
            fixture.detectChanges();

            const headerPro = fixture.debugElement.query(By.css(userCoverTag));
            const proBadge = fixture.debugElement.query(By.css(proBadgeSelector)).nativeNode;
            const aboutSection = fixture.debugElement
              .queryAll(By.css(boldTitleClass))
              .find((anchors) => anchors.nativeElement.innerHTML === 'About').nativeElement;

            expect(headerPro).toBeTruthy();
            expect(proBadge.hasAttribute('hidden')).toBe(false);
            expect(aboutSection).toBeTruthy();
          });
        });

        describe('when NOT have the extra info...', () => {
          it('should show the pro elements but not the about one', () => {
            component.userInfo.extraInfo.description = null;

            fixture.detectChanges();
            const headerPro = fixture.debugElement.query(By.css(userCoverTag));
            const proBadge = fixture.debugElement.query(By.css(proBadgeSelector)).nativeNode;
            const aboutSection = fixture.debugElement.queryAll(By.css(boldTitleClass));

            expect(headerPro).toBeTruthy();
            expect(proBadge.hasAttribute('hidden')).toBe(false);
            expect(aboutSection.length).toBe(1);
          });
        });

        it('should show cover', () => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.directive(MockCoverUpload))).toBeTruthy();
        });
      });
      describe('and has not subscriptions permission', () => {
        beforeEach(() => {
          permissionService.removePermission(PERMISSIONS.subscriptions);
        });
        it('should NOT show the pro elements', () => {
          fixture.detectChanges();

          const headerPro = fixture.debugElement.query(By.css(userCoverTag));
          const proBadge = fixture.debugElement.query(By.css(proBadgeSelector));
          const aboutSection = fixture.debugElement.queryAll(By.css(boldTitleClass));

          expect(headerPro).toBeFalsy();
          expect(proBadge).toBeFalsy();
          expect(aboutSection.length).toBe(0);
        });
        it('should not show not cover', () => {
          fixture.detectChanges();

          expect(fixture.debugElement.query(By.directive(MockCoverUpload))).toBeFalsy();
        });
      });
    });

    describe('when the user is NOT pro...', () => {
      it('should NOT show the pro elements', () => {
        component.userInfo.featured = false;

        fixture.detectChanges();
        const headerPro = fixture.debugElement.query(By.css(userCoverTag));
        const proBadge = fixture.debugElement.query(By.css(proBadgeSelector));
        const aboutSection = fixture.debugElement.queryAll(By.css(boldTitleClass));

        expect(headerPro).toBeFalsy();
        expect(proBadge).toBeFalsy();
        expect(aboutSection.length).toBe(0);
      });
    });
  });

  describe('when we NOT have the user info and the stats', () => {
    it('should NOT load the content', () => {
      component.userInfo = null;

      fixture.detectChanges();
      const containerPage = fixture.debugElement.query(By.css(profileContainerClass));

      expect(containerPage).toBeFalsy();
    });
  });
});
