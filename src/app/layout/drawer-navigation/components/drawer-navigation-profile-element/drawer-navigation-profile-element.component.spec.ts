import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ProBadgeStubComponent } from '@fixtures/shared/components/pro-badge.component.stub';
import { StarsStubComponent } from '@fixtures/shared/components/stars.component.stub';
import { SvgIconStubComponent } from '@fixtures/shared/components/svg-icon.component.stub';
import { UserAvatarStubComponent } from '@fixtures/shared/components/user-avatar.component.stub';
import { IMAGE, MOCK_USER, MOCK_USER_STATS } from '@fixtures/user.fixtures.spec';
import { DrawerNavigationProfileElement } from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

import { DrawerNavigationProfileElementComponent } from './drawer-navigation-profile-element.component';

describe('DrawerNavigationProfileElementComponent', () => {
  let component: DrawerNavigationProfileElementComponent;
  let fixture: ComponentFixture<DrawerNavigationProfileElementComponent>;

  const MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT: DrawerNavigationProfileElement = {
    professional: MOCK_USER.featured,
    text: MOCK_USER.microName,
    alternativeText: MOCK_USER.microName,
    reviews: MOCK_USER_STATS.ratings.reviews,
    reviews_count: MOCK_USER_STATS.counters.reviews,
    avatar: IMAGE.urls_by_size.medium,
    href: `${PRIVATE_PATHS.PROFILE}`,
    external: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        DrawerNavigationProfileElementComponent,
        UserAvatarStubComponent,
        SvgIconStubComponent,
        StarsStubComponent,
        ProBadgeStubComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerNavigationProfileElementComponent);
    component = fixture.componentInstance;
  });

  describe('when the component is rendered', () => {
    describe('and the information is still loading', () => {
      it('should show the placeholder', () => {
        component.element = null;

        fixture.detectChanges();
        const avatarPlaceholder = fixture.debugElement.query(By.css('.DrawerNavigationProfileElement__avatarPlaceholder'));
        const usernamePlaceholder = fixture.debugElement.query(By.css('.DrawerNavigationProfileElement__usernamePlaceholder'));
        const textPlaceholder = fixture.debugElement.query(By.css('.DrawerNavigationProfileElement__textPlaceholder'));

        expect(avatarPlaceholder).toBeTruthy();
        expect(usernamePlaceholder).toBeTruthy();
        expect(textPlaceholder).toBeTruthy();
      });
    });

    describe('and the information is loaded', () => {
      it('should render the navigation link', () => {
        component.element = MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const navigationLink = fixture.debugElement.query(By.css('.DrawerNavigationProfileElement')).nativeElement;

        expect(navigationLink.getAttribute('href')).toEqual(`/${MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT.href}`);
      });

      it('should show the user avatar', () => {
        component.element = MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const userAvatar = fixture.debugElement.query(By.css('tsl-user-avatar')).componentInstance;

        expect(userAvatar.imageUrl).toEqual(MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT.avatar);
      });

      it('should show the user reviews', () => {
        component.element = MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const userStars = fixture.debugElement.query(By.css('tsl-stars')).componentInstance;

        expect(userStars.stars).toEqual(MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT.reviews);
      });

      it('should show the user number of reviews', () => {
        component.element = MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT;

        fixture.detectChanges();
        const reviewsCount = fixture.debugElement.query(By.css('.DrawerNavigationProfileElement__reviewsCount')).nativeElement;

        expect(reviewsCount.innerHTML).toEqual(`(${MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT.reviews_count})`);
      });

      describe('and the user is a professional', () => {
        it('should show the professional badge', () => {
          component.element = { ...MOCK_DRAWER_NAVIGATION_PROFILE_ELEMENT, professional: true };

          fixture.detectChanges();
          const proBadge = fixture.debugElement.query(By.css('tsl-pro-badge')).nativeElement;

          expect(proBadge).toBeTruthy();
        });
      });
    });
  });
});
