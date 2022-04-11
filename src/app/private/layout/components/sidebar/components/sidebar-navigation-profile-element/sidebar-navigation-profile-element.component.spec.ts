import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT } from '@fixtures/private/layout/sidebar/fixtures/sidebar-navigation-profile-element.fixtures.spec';
import { ProBadgeStubComponent } from '@fixtures/shared/components/pro-badge.component.stub';
import { StarsStubComponent } from '@fixtures/shared/components/stars.component.stub';
import { SvgIconStubComponent } from '@fixtures/shared/components/svg-icon.component.stub';
import { UserAvatarStubComponent } from '@fixtures/shared/components/user-avatar.component.stub';

import { SidebarNavigationProfileElementComponent } from './sidebar-navigation-profile-element.component';

describe('SidebarNavigationProfileElementComponent', () => {
  let component: SidebarNavigationProfileElementComponent;
  let fixture: ComponentFixture<SidebarNavigationProfileElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        SidebarNavigationProfileElementComponent,
        UserAvatarStubComponent,
        SvgIconStubComponent,
        StarsStubComponent,
        ProBadgeStubComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarNavigationProfileElementComponent);
    component = fixture.componentInstance;
  });

  describe('when the component is rendered', () => {
    describe('and the information is still loading', () => {
      it('should show the placeholder', () => {
        component.element = null;

        fixture.detectChanges();
        const avatarPlaceholder = fixture.debugElement.query(By.css('.SidebarNavigationProfileElement__avatarPlaceholder'));
        const usernamePlaceholder = fixture.debugElement.query(By.css('.SidebarNavigationProfileElement__usernamePlaceholder'));
        const textPlaceholder = fixture.debugElement.query(By.css('.SidebarNavigationProfileElement__textPlaceholder'));

        expect(avatarPlaceholder).toBeTruthy();
        expect(usernamePlaceholder).toBeTruthy();
        expect(textPlaceholder).toBeTruthy();
      });
    });

    describe('and the information is loaded', () => {
      it('should show the navigation link', () => {
        component.element = MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const navigationLink = fixture.debugElement.query(By.css('.SidebarNavigationProfileElement')).nativeElement;

        expect(navigationLink.getAttribute('href')).toEqual(`/${MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT.href}`);
      });

      it('should show the user avatar', () => {
        component.element = MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const userAvatar = fixture.debugElement.query(By.directive(UserAvatarStubComponent)).componentInstance;

        expect(userAvatar.imageUrl).toEqual(MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT.avatar);
      });

      it('should show the user reviews', () => {
        component.element = MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const userStars = fixture.debugElement.query(By.directive(StarsStubComponent)).componentInstance;

        expect(userStars.stars).toEqual(MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT.reviews);
      });

      it('should show the number of reviews', () => {
        component.element = MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const reviewsCount = fixture.debugElement.query(By.css('.SidebarNavigationProfileElement__reviewsCount')).nativeElement;

        expect(reviewsCount.innerHTML).toEqual(`(${MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT.reviews_count})`);
      });

      describe('and the sidebar is collapsed', () => {
        it('should hide the user information (username, reviews and reviews count)', () => {
          component.element = MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT;
          component.collapsed = true;

          fixture.detectChanges();
          const userInformationElement = fixture.debugElement.query(By.css('.SidebarNavigationProfileElement__user')).nativeElement;

          expect(userInformationElement.hidden).toEqual(true);
        });
      });

      describe('and the user is a professional', () => {
        it('should show the professional badge', () => {
          component.element = { ...MOCK_SIDEBAR_NAVIGATION_PROFILE_ELEMENT, isPro: true };

          fixture.detectChanges();
          const proBadge = fixture.debugElement.query(By.directive(ProBadgeStubComponent)).nativeElement;

          expect(proBadge).toBeTruthy();
        });
      });
    });
  });
});
